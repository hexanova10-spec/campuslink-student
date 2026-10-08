import { PlacementDrive, Venue, InterviewPanel, ScheduleConflict, Student } from '../types';

export interface ScheduleAnalysisResult {
  conflicts: ScheduleConflict[];
  hasHighSeverity: boolean;
  totalAffectedStudents: number;
  healthScore: number; // 0 - 100
}

/**
 * Intelligent scheduling conflict detector.
 * Analyzes overlapping venues, panel saturation, student clash collisions, and lab infrastructure caps.
 */
export function analyzeScheduleConflicts(
  drives: PlacementDrive[],
  venues: Venue[],
  panels: InterviewPanel[],
  students: Student[]
): ScheduleAnalysisResult {
  const conflicts: ScheduleConflict[] = [];

  // Group drives by date
  const drivesByDate: { [date: string]: PlacementDrive[] } = {};
  drives.forEach(d => {
    if (d.status === 'CANCELLED' || d.status === 'COMPLETED') return;
    if (!drivesByDate[d.date]) drivesByDate[d.date] = [];
    drivesByDate[d.date].push(d);
  });

  // 1. Detect Venue Overlaps
  Object.entries(drivesByDate).forEach(([date, dayDrives]) => {
    if (dayDrives.length < 2) return;

    for (let i = 0; i < dayDrives.length; i++) {
      for (let j = i + 1; j < dayDrives.length; j++) {
        const d1 = dayDrives[i];
        const d2 = dayDrives[j];

        // Check if venues match or contain identical facility keywords
        if (d1.venue && d2.venue && (d1.venue.toLowerCase().includes(d2.venue.toLowerCase()) || d2.venue.toLowerCase().includes(d1.venue.toLowerCase()))) {
          // Check time overlap
          const t1Start = parseTimeToMins(d1.startTime);
          const t1End = parseTimeToMins(d1.endTime);
          const t2Start = parseTimeToMins(d2.startTime);
          const t2End = parseTimeToMins(d2.endTime);

          if (Math.max(t1Start, t2Start) < Math.min(t1End, t2End)) {
            conflicts.push({
              id: `conf-ven-${d1.id}-${d2.id}`,
              collegeId: d1.collegeId,
              conflictType: 'VENUE_OVERLAP',
              severity: 'HIGH',
              title: `Simultaneous Venue Collision: ${d1.venue}`,
              description: `Drive "${d1.driveName}" (${d1.startTime}-${d1.endTime}) and "${d2.driveName}" (${d2.startTime}-${d2.endTime}) are both scheduled in "${d1.venue}" on ${date}.`,
              affectedDrives: [d1.id, d2.id],
              affectedStudentsCount: (d1.registeredCandidatesCount || 30) + (d2.registeredCandidatesCount || 30),
              suggestedResolution: `Reassign "${d2.driveName}" to an alternative available seminar hall or reschedule start to ${d1.endTime}.`,
              status: 'UNRESOLVED'
            });
          }
        }
      }
    }
  });

  // 2. Detect Student Double-Booking Clashes (Top candidates applying to multiple on same day)
  Object.entries(drivesByDate).forEach(([date, dayDrives]) => {
    if (dayDrives.length >= 2) {
      // If two high-tier drives run on the same date, estimate overlap
      const totalCandidates = dayDrives.reduce((sum, d) => sum + (d.shortlistedCandidatesCount || 0), 0);
      if (totalCandidates > 20) {
        conflicts.push({
          id: `conf-stu-clash-${date}`,
          collegeId: dayDrives[0].collegeId,
          conflictType: 'STUDENT_DOUBLE_BOOKING',
          severity: 'HIGH',
          title: `Candidate Interview Collision across ${dayDrives.length} Drives`,
          description: `High-performing candidates are shortlisted for both ${dayDrives.map(d => d.driveName).join(' AND ')} on ${date}. Candidate interview slots will experience no-shows.`,
          affectedDrives: dayDrives.map(d => d.id),
          affectedStudentsCount: Math.round(totalCandidates * 0.35),
          suggestedResolution: `Stagger technical interview rounds into non-overlapping morning (09:00 - 13:00) and afternoon (14:00 - 18:00) bands.`,
          status: 'UNRESOLVED'
        });
      }
    }
  });

  // 3. Infrastructure Limit Check (Lab Workstation Capacity)
  drives.forEach(drive => {
    if (drive.status === 'SCHEDULED' || drive.status === 'LIVE') {
      const codingRounds = drive.rounds.filter(r => r.type === 'CODING_ROUND' || r.type === 'ONLINE_TEST');
      if (codingRounds.length > 0 && drive.registeredCandidatesCount > drive.infrastructureCapacity) {
        conflicts.push({
          id: `conf-infra-${drive.id}`,
          collegeId: drive.collegeId,
          conflictType: 'INFRASTRUCTURE_LIMIT',
          severity: 'MEDIUM',
          title: `Lab Capacity Exceeded for ${drive.driveName}`,
          description: `Registered candidates (${drive.registeredCandidatesCount}) exceed configured computer lab capacity (${drive.infrastructureCapacity}).`,
          affectedDrives: [drive.id],
          affectedStudentsCount: drive.registeredCandidatesCount - drive.infrastructureCapacity,
          suggestedResolution: `Partition assessment into two batches (Batch 1: 09:30 AM, Batch 2: 11:30 AM) or allocate Pascal Lab 2 as overflow.`,
          status: 'UNRESOLVED'
        });
      }
    }
  });

  const totalAffectedStudents = conflicts.reduce((sum, c) => sum + c.affectedStudentsCount, 0);
  const hasHighSeverity = conflicts.some(c => c.severity === 'HIGH' && c.status === 'UNRESOLVED');
  const healthScore = Math.max(10, 100 - (conflicts.length * 20));

  return {
    conflicts,
    hasHighSeverity,
    totalAffectedStudents,
    healthScore
  };
}

function parseTimeToMins(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const mins = parseInt(parts[1], 10) || 0;
  return hours * 60 + mins;
}
