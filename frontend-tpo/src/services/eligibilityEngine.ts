import { Student, Job } from '../types';

export interface EligibilityResult {
  isEligible: boolean;
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE';
  failures: {
    rule: string;
    required: string | number | string[] | number[];
    actual: string | number | string[] | number[];
    reason: string;
  }[];
  passedRules: string[];
  summaryMessage: string;
}

/**
 * Deterministic institutional eligibility engine.
 * Does not hallucinate and generates mathematically exact audit statements.
 */
export function evaluateEligibility(student: Student, job: Job): EligibilityResult {
  const failures: EligibilityResult['failures'] = [];
  const passedRules: string[] = [];
  const criteria = job.eligibilityCriteria;

  // 1. CGPA Rule
  if (student.cgpa < criteria.minCgpa) {
    failures.push({
      rule: 'Minimum CGPA Cutoff',
      required: criteria.minCgpa.toFixed(2),
      actual: student.cgpa.toFixed(2),
      reason: `CGPA requirement: ${criteria.minCgpa.toFixed(2)} | Student CGPA: ${student.cgpa.toFixed(2)} (Deficit: ${(criteria.minCgpa - student.cgpa).toFixed(2)})`
    });
  } else {
    passedRules.push(`CGPA verified (${student.cgpa.toFixed(2)} >= ${criteria.minCgpa.toFixed(2)})`);
  }

  // 2. Branch Rule
  if (criteria.eligibleBranches && criteria.eligibleBranches.length > 0) {
    const isBranchAllowed = criteria.eligibleBranches.some(
      b => b.toUpperCase() === student.branch.toUpperCase()
    );
    if (!isBranchAllowed) {
      failures.push({
        rule: 'Allowed Engineering Branches',
        required: criteria.eligibleBranches,
        actual: student.branch,
        reason: `Branch requirement: [${criteria.eligibleBranches.join(', ')}] | Student branch: ${student.branch} is not permissible for this role`
      });
    } else {
      passedRules.push(`Branch ${student.branch} is in approved list`);
    }
  }

  // 3. Graduation Year Rule
  if (criteria.allowedGraduationYears && criteria.allowedGraduationYears.length > 0) {
    if (!criteria.allowedGraduationYears.includes(student.graduationYear)) {
      failures.push({
        rule: 'Graduation Batch Cohort',
        required: criteria.allowedGraduationYears,
        actual: student.graduationYear,
        reason: `Target batch: [${criteria.allowedGraduationYears.join(', ')}] | Student graduation year is ${student.graduationYear}`
      });
    } else {
      passedRules.push(`Graduation year ${student.graduationYear} matched target batch`);
    }
  }

  // 4. Backlog Rule
  if (student.activeBacklogs > criteria.maxBacklogs) {
    failures.push({
      rule: 'Active Backlog Restriction',
      required: criteria.maxBacklogs,
      actual: student.activeBacklogs,
      reason: `Maximum active backlogs allowed: ${criteria.maxBacklogs} | Student currently has ${student.activeBacklogs} active backlog(s)`
    });
  } else {
    passedRules.push(`Active backlogs (${student.activeBacklogs}) within acceptable limit (${criteria.maxBacklogs})`);
  }

  // 5. 10th Standard Percentage
  if (criteria.tenthMinPercent && student.tenthPercentage < criteria.tenthMinPercent) {
    failures.push({
      rule: '10th Standard Academic Minimum',
      required: `${criteria.tenthMinPercent}%`,
      actual: `${student.tenthPercentage}%`,
      reason: `10th requirement: ${criteria.tenthMinPercent}% | Student achieved: ${student.tenthPercentage}%`
    });
  } else if (criteria.tenthMinPercent) {
    passedRules.push(`10th standard cutoff cleared (${student.tenthPercentage}% >= ${criteria.tenthMinPercent}%)`);
  }

  // 6. 12th / Diploma Standard Percentage
  if (criteria.twelfthMinPercent && student.twelfthPercentage < criteria.twelfthMinPercent) {
    failures.push({
      rule: '12th/Diploma Academic Minimum',
      required: `${criteria.twelfthMinPercent}%`,
      actual: `${student.twelfthPercentage}%`,
      reason: `12th requirement: ${criteria.twelfthMinPercent}% | Student achieved: ${student.twelfthPercentage}%`
    });
  } else if (criteria.twelfthMinPercent) {
    passedRules.push(`12th standard cutoff cleared (${student.twelfthPercentage}% >= ${criteria.twelfthMinPercent}%)`);
  }

  // 7. Mandatory Skill Check (if required by job)
  if (criteria.requiredSkills && criteria.requiredSkills.length > 0) {
    const studentAllSkills = [...student.primarySkills, ...student.secondarySkills].map(s => s.toLowerCase());
    const missingSkills = criteria.requiredSkills.filter(
      req => !studentAllSkills.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))
    );

    if (missingSkills.length > 0) {
      failures.push({
        rule: 'Mandatory Technical Competency',
        required: criteria.requiredSkills,
        actual: student.primarySkills,
        reason: `Missing mandatory required skill(s): ${missingSkills.join(', ')}`
      });
    } else {
      passedRules.push(`All ${criteria.requiredSkills.length} mandatory skill(s) verified`);
    }
  }

  const isEligible = failures.length === 0;

  let summaryMessage = '';
  if (isEligible) {
    summaryMessage = `ELIGIBLE: Candidate satisfies all ${passedRules.length} institutional and corporate eligibility criteria.`;
  } else {
    summaryMessage = `NOT ELIGIBLE: Failed ${failures.length} criteria: ${failures.map(f => f.rule).join(', ')}.`;
  }

  return {
    isEligible,
    status: isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE',
    failures,
    passedRules,
    summaryMessage
  };
}

export function evaluateStudentPool(students: Student[], job: Job) {
  const eligible: { student: Student; result: EligibilityResult }[] = [];
  const ineligible: { student: Student; result: EligibilityResult }[] = [];

  students.forEach(student => {
    const res = evaluateEligibility(student, job);
    if (res.isEligible) {
      eligible.push({ student, result: res });
    } else {
      ineligible.push({ student, result: res });
    }
  });

  return { eligible, ineligible };
}
