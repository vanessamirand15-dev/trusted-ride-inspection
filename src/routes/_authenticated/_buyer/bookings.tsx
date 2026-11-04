import { Bookings } from '@/components/customer-bookings';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Plus, ArrowUpRight, CarFront, CalendarDays, MapPin } from 'lucide-react';
import { AccountGate, AccountLayout, StatusBadge, displayDate } from '@/components/account-ui';
import { useBookings } from '@/components/demo-account';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/_authenticated/_buyer/bookings')({ head: () => pageHead('Your Bookings', 'Review your vehicle inspections and follow each booking’s progress.'), component: Page });
function Page() { return <AccountGate><Bookings /></AccountGate>; }
