export default function About() {
  return (
    <section className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <p className="eyebrow">About JobConnect</p>
        <h1>Connecting job seekers and recruiters</h1>
        <p>
          JobConnect is a full-stack online job portal built as a BCA final-year academic project. It
          demonstrates registration, login, role-based dashboards, job posting, and application
          tracking using the MERN stack.
        </p>
        <h2>Project objectives</h2>
        <p>
          Help students practice React, Node.js, Express, MongoDB, and JWT authentication in one
          complete website that a faculty member can run locally and demonstrate.
        </p>
        <h2>Who it is for</h2>
        <p>Job seekers searching for openings, recruiters posting vacancies, and an administrator who reviews platform activity.</p>
        <h2>Important note</h2>
        <p>
          Sample listings created by the seed script are labelled as demonstration data. They are not
          real company vacancies.
        </p>
      </div>
    </section>
  );
}
