import React from 'react';
import LegalPage from './LegalPage';

// About Us page for KaziApa
// Uses the same LegalPage shell as Privacy Policy / Terms of Service
// Adjust the LegalPage import path and prop names to match your actual shell if they differ.

const AboutUs = () => {
  return (
    <LegalPage title="About Us">
      <p className="intro-line">
        Every community has people with skills, businesses with potential,
        farmers with harvests, and families looking for opportunities.
        KaziApa exists to help those people discover one another and build
        stronger communities together.
      </p>

      <h2>Our Story</h2>
      <p>
        When we looked around our community, we saw something that didn't
        make sense. People were looking for jobs. Businesses were looking
        for workers. Farmers were looking for buyers. Families were looking
        for houses. People were searching for fundis, transport, and
        everyday services.
      </p>
      <p>
        Yet many of these opportunities already existed nearby. A skilled
        fundi could live in the same neighbourhood as someone desperately
        looking for one. A farmer might transport produce hundreds of
        kilometres while buyers nearby import the same products from
        elsewhere.
      </p>
      <p>
        Communities already had the people, the skills, and the
        opportunities. They simply lacked a bridge. That bridge became
        KaziApa.
      </p>
      <p>
        The word "Hapa" means "here." It reminds us that sometimes the
        answer isn't somewhere else — sometimes the answer is already here.
      </p>
      <p className="tagline">
        Opportunity is already hapa. We connect you.
      </p>

      <h2>Our Mission</h2>
      <p>
        To connect people with jobs, businesses, housing, transport,
        services, agriculture, and everyday opportunities through trusted
        technology that strengthens communities and improves lives.
      </p>

      <h2>Our Vision</h2>
      <p>
        To build Africa's most trusted community platform where every
        person can discover opportunities already around them, and every
        community can grow stronger through meaningful local connections.
      </p>

      <h2>Our Values</h2>
      <ul className="values-list">
        <li>
          <strong>Community First</strong> — Every decision should
          strengthen local communities.
        </li>
        <li>
          <strong>Trust Before Growth</strong> — Growth without trust
          doesn't last.
        </li>
        <li>
          <strong>Think Local</strong> — The next opportunity may be only a
          few steps away.
        </li>
        <li>
          <strong>Innovation With Purpose</strong> — Technology should solve
          real human problems.
        </li>
        <li>
          <strong>Everyone Deserves Opportunity</strong> — Opportunity
          should not depend on who you know or where you live.
        </li>
      </ul>

      <h2>About Kazinasi Technologies</h2>
      <p>
        KaziApa is built and operated by Kazinasi Technologies, a Kenyan
        technology company founded to strengthen local communities through
        trusted, hyperlocal digital tools.
      </p>
      <p className="founder-line">
        Built by Stephen Onyango Araff, Founder of Kazinasi Technologies.
      </p>
    </LegalPage>
  );
};

export default AboutUs;
