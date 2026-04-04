'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import type { NurlySupportTicket, NurslyIncident } from '@/lib/types';

type EscalationItem = NurlySupportTicket | NurslyIncident;

export default function EscalationsPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<NurlySupportTicket[]>([]);
  const [incidents, setIncidents] = useState<NurslyIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEscalations = async () => {
      try {
        const supabase = createClient();

        const { data: ticketsData } = await supabase
          .from('nursly_support_tickets')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        const { data: incidentsData } = await supabase
          .from('nursly_incidents')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        setTickets((ticketsData as NurlySupportTicket[]) || []);
        setIncidents((incidentsData as NurslyIncident[]) || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEscalations();
  }, []);

  const priorityColor = (priority: string) => {
    if (priority === 'p1') return 'danger';
    if (priority === 'p2') return 'warning';
    return 'secondary';
  };

  const handleReviewTicket = async (ticketId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('nursly_support_tickets')
        .update({ status: 'in_progress' })
        .eq('id', ticketId);

      if (error) {
        toast('Failed to update ticket', 'error');
      } else {
        setTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? { ...t, status: 'in_progress' } : t))
        );
        toast('Ticket status updated to In Progress', 'success');
      }
    } catch (err) {
      console.error('Error:', err);
      toast('Failed to review ticket', 'error');
    }
  };

  const handleInvestigateIncident = async (incidentId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('nursly_incidents')
        .update({ status: 'investigating' })
        .eq('id', incidentId);

      if (error) {
        toast('Failed to update incident', 'error');
      } else {
        setIncidents((prev) =>
          prev.map((i) => (i.id === incidentId ? { ...i, status: 'investigating' } : i))
        );
        toast('Incident status updated to Investigating', 'success');
      }
    } catch (err) {
      console.error('Error:', err);
      toast('Failed to investigate incident', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Escalations & Incidents</h1>
          <p className="mt-2 text-gray-600">Manage support tickets and system incidents</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading escalations...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Escalations & Incidents</h1>
        <p className="mt-2 text-gray-600">Manage support tickets and system incidents</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Open tickets</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{tickets.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Open incidents</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{incidents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total escalations</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{tickets.length + incidents.length}</p>
          </CardContent>
        </Card>
      </div>

      {tickets.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Support Tickets ({tickets.length})</h2>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                      <p className="mt-1 text-sm text-gray-600">{ticket.description}</p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant={priorityColor(ticket.priority)} className="capitalize">
                          {ticket.priority}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {ticket.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Created {formatDate(ticket.created_at)}
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleReviewTicket(ticket.id)}
                        className="mt-2"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {incidents.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">System Incidents ({incidents.length})</h2>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{incident.description}</p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant={priorityColor(incident.severity)} className="capitalize">
                          {incident.severity}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Reported {formatDate(incident.created_at)}
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleInvestigateIncident(incident.id)}
                        className="mt-2"
                      >
                        Investigate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tickets.length === 0 && incidents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium text-gray-900">No open escalations</p>
            <p className="mt-1 text-gray-600">All tickets and incidents are resolved</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
