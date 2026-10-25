/**
 * Inserts clearly labelled demonstration job listings.
 * These are sample records for a BCA project demo, not real vacancies.
 */
const { getConfig } = require('../config/env');
const { connectDatabase, disconnectDatabase } = require('../config/db');
const User = require('../models/User');
const Job = require('../models/Job');
const { ROLES, JOB_TYPES, JOB_CATEGORIES } = require('../config/constants');

const SAMPLE_JOBS = [
  {
    title: 'Junior Web Developer (Demonstration Listing)',
    companyName: 'Sample Employer A (Demo)',
    location: 'Bengaluru',
    jobType: JOB_TYPES[0],
    category: JOB_CATEGORIES[0],
    salaryRange: '₹3.5 LPA – ₹5.5 LPA (sample)',
    description:
      'Demonstration listing for JobConnect. A junior developer would work with HTML, CSS, JavaScript, and React. This is sample data for academic demonstration only.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
    experienceRequired: '0–2 years (sample)',
  },
  {
    title: 'Digital Marketing Associate (Demonstration Listing)',
    companyName: 'Sample Employer B (Demo)',
    location: 'Hyderabad',
    jobType: JOB_TYPES[1],
    category: JOB_CATEGORIES[1],
    salaryRange: '₹3 LPA – ₹4.5 LPA (sample)',
    description:
      'Demonstration listing for campaign support, content planning, and basic analytics. This is not a real job opening.',
    requiredSkills: ['Content writing', 'SEO basics', 'Canva'],
    experienceRequired: '0–1 year (sample)',
  },
  {
    title: 'Accounts Assistant (Demonstration Listing)',
    companyName: 'Sample Employer C (Demo)',
    location: 'Pune',
    jobType: JOB_TYPES[0],
    category: JOB_CATEGORIES[2],
    salaryRange: '₹2.8 LPA – ₹4 LPA (sample)',
    description:
      'Demonstration listing for invoice entry, reconciliation, and monthly reports. Sample data only.',
    requiredSkills: ['Tally', 'MS Excel', 'GST basics'],
    experienceRequired: '1 year (sample)',
  },
  {
    title: 'UI Designer Intern (Demonstration Listing)',
    companyName: 'Sample Employer D (Demo)',
    location: 'Remote',
    jobType: JOB_TYPES[2],
    category: JOB_CATEGORIES[5],
    salaryRange: '₹10,000 – ₹15,000 / month (sample stipend)',
    description:
      'Demonstration internship listing for wireframes and visual design practice. Not a real vacancy.',
    requiredSkills: ['Figma', 'Typography', 'Color theory'],
    experienceRequired: 'Fresher (sample)',
  },
  {
    title: 'Customer Support Executive (Demonstration Listing)',
    companyName: 'Sample Employer E (Demo)',
    location: 'Chennai',
    jobType: JOB_TYPES[0],
    category: JOB_CATEGORIES[9],
    salaryRange: '₹2.4 LPA – ₹3.6 LPA (sample)',
    description:
      'Demonstration listing for handling customer queries by email and chat. Academic sample data only.',
    requiredSkills: ['Communication', 'MS Office', 'Patience'],
    experienceRequired: '0–1 year (sample)',
  },
  {
    title: 'Java Backend Trainee (Demonstration Listing)',
    companyName: 'Sample Employer F (Demo)',
    location: 'Mumbai',
    jobType: JOB_TYPES[0],
    category: JOB_CATEGORIES[8],
    salaryRange: '₹4 LPA – ₹6 LPA (sample)',
    description:
      'Demonstration listing for learning REST APIs with Java. This record exists so the Browse Jobs page has sample cards.',
    requiredSkills: ['Java', 'SQL', 'Git'],
    experienceRequired: 'Fresher (sample)',
  },
];

async function seed() {
  const password = process.env.DEMO_SEED_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error('Set DEMO_SEED_PASSWORD (min 8 characters) in backend/.env before seeding.');
  }

  const config = getConfig();
  await connectDatabase(config.mongoUri);

  let recruiter = await User.findOne({ email: 'demo.recruiter@jobconnect.local' });
  if (!recruiter) {
    recruiter = await User.create({
      name: 'Demo Recruiter (Sample Account)',
      email: 'demo.recruiter@jobconnect.local',
      password,
      role: ROLES.RECRUITER,
      companyName: 'JobConnect Sample Employer',
      companyDescription: 'This recruiter account is created by the seed script for demonstration only.',
      isDemoAccount: true,
    });
    console.log('Created labelled demo recruiter: demo.recruiter@jobconnect.local');
  }

  await Job.deleteMany({ isDemo: true });

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 45);

  const jobs = SAMPLE_JOBS.map((job) => ({
    ...job,
    applicationDeadline: deadline,
    postedBy: recruiter._id,
    isDemo: true,
  }));

  await Job.insertMany(jobs);
  console.log(`Inserted ${jobs.length} demonstration job listings. They are marked isDemo=true.`);
}

seed()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
