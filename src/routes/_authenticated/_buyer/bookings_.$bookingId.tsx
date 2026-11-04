import { Detail } from '@/components/customer-booking-detail';
import { createFileRoute, Link } from '@tanstack/react-router';
import inspectionPhotos from '@/lib/inspection-photos';
import { InspectionReport } from '@/components/inspection-report';
import { useState } from 'react';
import { ArrowLeft, Check, MessageSquare, X, FileText } from 'lucide-react';
import { AccountGate, StatusBadge, displayTime, displayDate } from '@/components/account-ui';
import { useBookings, useDemoAccount } from '@/components/demo-account';
import { stages, canCancel, statusOf } from '@/lib/demo-bookings';
import { pageHead } from '@/lib/page-head';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
export const Route = createFileRoute('/_authenticated/_buyer/bookings_/$bookingId')({ head: () => pageHead('Inspection booking', 'View your inspection timeline, inspector, and booking details.'), component: Page });
function Page() { const { bookingId } = Route.useParams(); return <AccountGate><Detail bookingId={bookingId} /></AccountGate>; }
