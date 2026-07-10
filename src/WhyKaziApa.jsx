import React from 'react';
import LegalPage from './LegalPage';

// "Why KaziApa?" page — brand story / manifesto, separate from About Us.
// About Us tells people who we are. This page tells people why KaziApa exists.

const WhyKaziApa = () => {
  return (
    <LegalPage title="Why KaziApa?">
      <p>Every day, millions of people wake up looking for something.</p>
      <p className="manifesto-list">
        A job. A customer. A worker. A house. A tenant. A fundi. A boda
        rider. Fresh farm produce. A business opportunity.
      </p>
      <p>Most believe they must search far away to find it.</p>
      <p className="highlight">
        But what if the opportunity they're looking for is already here?
      </p>

      <p className="manifesto-questions">
        What if the carpenter lives on your street?
        <br />
        What if the mechanic is your neighbour?
        <br />
        What if the farmer is in the next village?
        <br />
        What if the employer attends the same church?
        <br />
        What if your next customer walks past your business every morning?
      </p>

      <p>
        The opportunity has always existed. The missing piece is the
        connection.
      </p>

      <p>That is why KaziApa was born.</p>

      <p>
        Not simply to build another marketplace. Not simply to create
        another app. But to connect communities.
      </p>

      <p>Because when people discover each other:</p>
      <ul className="manifesto-benefits">
        <li>Businesses grow.</li>
        <li>Young people find work.</li>
        <li>Families earn income.</li>
        <li>Farmers find markets.</li>
        <li>Small businesses thrive.</li>
        <li>Communities become stronger.</li>
      </ul>

      <p>
        A stronger community builds a stronger county. Stronger counties
        build a stronger Kenya.
      </p>

      <p className="highlight">
        Technology should not replace communities. Technology should
        strengthen them.
      </p>

      <p>That is our mission. That is our purpose. That is KaziApa.</p>

      <p className="tagline">Opportunity is already hapa. We connect you.</p>
    </LegalPage>
  );
};

export default WhyKaziApa;
