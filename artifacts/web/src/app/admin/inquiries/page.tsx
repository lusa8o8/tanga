"use client";
import React, { useState } from "react";
import { useListAdminInquiries, useUpdateInquiry, useDeleteInquiry, getListAdminInquiriesQueryKey } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

export default function AdminInquiriesList() {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: inquiries = [], isLoading } = useListAdminInquiries();
  const updateInquiry = useUpdateInquiry();
  const deleteInquiry = useDeleteInquiry();

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteInquiry.mutate({ id: deleteTarget }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAdminInquiriesQueryKey() });
        setDeleteTarget(null);
      },
    });
  };

  const handleStatusChange = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'new' ? 'in_progress' : currentStatus === 'in_progress' ? 'responded' : 'new';
    updateInquiry.mutate({ id, data: { status: nextStatus } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAdminInquiriesQueryKey() });
      }
    });
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
        <h1 className="text-4xl font-serif text-primary">Manage Inquiries</h1>
        <div className="text-sm text-muted-foreground bg-primary/5 px-4 py-2">
          New inquiries from the Bulk Orders form appear here.
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="text-muted-foreground py-8">Loading inquiries...</div>
        ) : inquiries.length > 0 ? (
          inquiries.map((inquiry: any) => (
            <div key={inquiry.id} className="flex flex-col gap-4 p-6 border border-border bg-background">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <span className="font-serif text-lg font-medium">{inquiry.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {inquiry.inquirerType}
                    </span>
                    <button
                      onClick={() => handleStatusChange(inquiry.id, inquiry.status)}
                      className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-medium transition-colors ${
                        inquiry.status === 'new' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                        inquiry.status === 'in_progress' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
                        'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                      disabled={updateInquiry.isPending}
                    >
                      {inquiry.status === 'new' ? 'New' : inquiry.status === 'in_progress' ? 'In Progress' : 'Responded'}
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-1">
                    <span>{inquiry.email}</span>
                    {inquiry.phone && <span>{inquiry.phone}</span>}
                    {inquiry.organizationName && <span>Org: {inquiry.organizationName}</span>}
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-0 border-border pt-4 sm:pt-0 mt-2 sm:mt-0">
                  <div className="text-sm text-muted-foreground">
                    {inquiry.createdAt ? format(new Date(inquiry.createdAt), "MMM d, yyyy h:mm a") : 'Unknown date'}
                  </div>
                  <button
                    onClick={() => setDeleteTarget(inquiry.id)}
                    className="text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 bg-muted/30 rounded">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Titles of Interest</div>
                  <div className="text-sm">{inquiry.titlesOfInterest || 'N/A'}</div>
                </div>
                {inquiry.inquirerType === 'school' && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Quantity Estimate</div>
                    <div className="text-sm">{inquiry.quantityInterest || 'N/A'}</div>
                  </div>
                )}
                <div className="md:col-span-2">
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Message</div>
                  <div className="text-sm whitespace-pre-wrap">{inquiry.message || 'N/A'}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground py-8">No inquiries found.</div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This inquiry will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-700 hover:bg-red-800 text-white"
              disabled={deleteInquiry.isPending}
            >
              {deleteInquiry.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
