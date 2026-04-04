'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';


const statusIcon = (status: string) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'pending':
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case 'expired':
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    default:
      return null;
  }
};

const statusBadge = (status: string) => {
  switch (status) {
    case 'verified':
      return <Badge variant="success">Verified</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'expired':
      return <Badge variant="danger">Expired</Badge>;
    default:
      return null;
  }
};

export default function CompliancePage() {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = (docId: string) => {
    setUploadingDocId(docId);
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingDocId || !userId) return;

    // Validate MIME type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      setUploadStatus('Only PDF, Word documents, JPEG, and PNG files are allowed.');
      setTimeout(() => setUploadStatus(null), 4000);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadingDocId(null);
      return;
    }

    // Validate file size: max 10 MB
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadStatus('File must be smaller than 10 MB.');
      setTimeout(() => setUploadStatus(null), 4000);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadingDocId(null);
      return;
    }

    setUploadStatus('Uploading...');
    try {
      const supabase = createClient();
      const doc = displayCredentials.find((d) => d.id === uploadingDocId);
      const docType = doc?.type || 'other';
      // Use a sanitised filename — strip path traversal characters
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${userId}/${docType}/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('credentials')
        .upload(storagePath, file, { upsert: true });

      if (uploadError) {
        setUploadStatus('Upload failed. Please try again.');
        setTimeout(() => setUploadStatus(null), 3000);
        setUploadingDocId(null);
        return;
      }

      // Upsert credential record with the storage path
      const { error: dbError } = await supabase
        .from('nursly_credentials')
        .upsert({
          id: uploadingDocId,
          nurse_id: userId,
          type: docType,
          document_key: storagePath,
          document_uploaded_at: new Date().toISOString(),
          status: 'pending',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (dbError) {
        setUploadStatus('File uploaded, but record update failed.');
      } else {
        setUploadStatus('File uploaded successfully!');
        // Refresh credentials
        const { data } = await supabase
          .from('nursly_credentials')
          .select('*')
          .eq('nurse_id', userId);
        if (data) setCredentials(data);
      }

      setTimeout(() => setUploadStatus(null), 3000);
    } catch {
      setUploadStatus('An unexpected error occurred.');
      setTimeout(() => setUploadStatus(null), 3000);
    } finally {
      setUploadingDocId(null);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleViewDocument = async (docId: string) => {
    const doc = displayCredentials.find((d) => d.id === docId);
    if (!doc) return;

    if (!doc.document_key) {
      setUploadStatus('No document available for this credential.');
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from('credentials')
        .createSignedUrl(doc.document_key, 60 * 60); // 1 hour expiry

      if (error || !data?.signedUrl) {
        setUploadStatus('Could not generate document link. Please try again.');
        setTimeout(() => setUploadStatus(null), 3000);
        return;
      }

      window.open(data.signedUrl, '_blank');
    } catch {
      setUploadStatus('An unexpected error occurred.');
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        setUserId(user.id);

        const { data, error } = await supabase
          .from('nursly_credentials')
          .select('*')
          .eq('nurse_id', user.id);

        if (!error) {
          setCredentials((data as any[]) || []);
        }
      } catch {
        // Silently handle — loading state is cleared in finally
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  const displayCredentials = credentials;
  const verifiedDocs = displayCredentials.filter((d) => d.status === 'verified');
  const allVerified = verifiedDocs.length === displayCredentials.length && displayCredentials.length > 0;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
      <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compliance & Documents</h1>
        <p className="mt-2 text-gray-600">Manage your verification documents and compliance status</p>
      </div>

      {uploadStatus && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${
          uploadStatus.includes('failed') || uploadStatus.includes('error') || uploadStatus.includes('Could not')
            ? 'border-red-200 bg-red-50 text-red-800'
            : uploadStatus.includes('successfully')
            ? 'border-green-200 bg-green-50 text-green-800'
            : 'border-blue-200 bg-blue-50 text-blue-800'
        }`}>
          {uploadStatus}
        </div>
      )}

      <Card className={allVerified ? 'border-green-200 bg-green-50' : ''}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                allVerified ? 'bg-green-100' : 'bg-yellow-100'
              }`}
            >
              <FileCheck
                className={`h-6 w-6 ${allVerified ? 'text-green-600' : 'text-yellow-600'}`}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {allVerified ? 'All documents verified' : 'Verification in progress'}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {allVerified
                  ? 'Great! Your profile is fully compliant. You can work on any shift.'
                  : `${verifiedDocs.length} of ${displayCredentials.length} documents verified`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-gray-600">Loading credentials...</p>
            </CardContent>
          </Card>
        ) : displayCredentials.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileCheck className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-lg font-medium text-gray-900">No documents uploaded yet</p>
              <p className="mt-1 text-gray-600">Upload your compliance documents to start working</p>
            </CardContent>
          </Card>
        ) : (
          displayCredentials.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{statusIcon(doc.status)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {doc.label || doc.type}
                      </h3>
                      {doc.verified_at && (
                        <p className="mt-1 text-sm text-gray-600">
                          Verified on {formatDate(doc.verified_at)}
                        </p>
                      )}
                      {doc.expiry_date && (
                        <p className="text-sm text-gray-600">
                          Expires on {formatDate(doc.expiry_date)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(doc.status)}
                    {uploadingDocId === doc.id && (
                      <span className="text-xs text-gray-600">Uploading...</span>
                    )}
                    {doc.status === 'pending' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUploadClick(doc.id)}
                        disabled={uploadingDocId === doc.id}
                      >
                        {uploadingDocId === doc.id ? 'Uploading...' : 'Upload'}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(doc.id)}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Essential Documents</h4>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                  DBS Enhanced Disclosure (valid for 3 years)
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                  Right to Work in the UK
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                  Mandatory Training
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Optional Documents</h4>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  NMC Registration (nursing)
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  Professional Indemnity Insurance
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  Specialist qualifications
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
