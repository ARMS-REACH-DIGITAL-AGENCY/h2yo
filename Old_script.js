const fortunes = [
  "You’re loved more than you know.",
  "Yo, today’s got potential.",
  "You’re doing better than you think.",
  "Someone’s glad you’re here.",
  "Keep going. Good things are moving toward you.",
  "Hydrated people make better decisions.",
  "Your presence matters more than you realize.",
  "Yo says: smile first, then make your move."
];
const fortuneBtn = document.getElementById('fortuneBtn');
const fortuneText = document.getElementById('fortuneText');
fortuneBtn?.addEventListener('click', () => {
  fortuneText.textContent = fortunes[Math.floor(Math.random() * fortunes.length)];
});

const baseline = {
  booster:{scan:[6,12,18], conv:[8,16,25], label:'Team / Booster Club'},
  nonprofit:{scan:[5,10,15], conv:[10,18,28], label:'Nonprofit / Cause'},
  business:{scan:[3,7,11], conv:[5,12,20], label:'Business / Sponsor'},
  event:{scan:[2,6,10], conv:[5,12,18], label:'Event / Trade Show'},
  church:{scan:[5,10,15], conv:[10,18,25], label:'Church / Community'}
};
const modifiers = {
  audienceWarmth:{warm:8,medium:4,cold:-3},
  distribution:{personal:8,sold:6,booth:4,table:1,passive:-4},
  hook:{none:-6,learn:-4,positive:4,win:8,offer:7,vote:6},
  story:{strong:7,some:3,promo:0,none:-4},
  timeline:{safe:5,ok:3,tight:-2,rush:-7}
};
const qtyByAudience = {250:1440,500:1440,1000:1440,2500:2880,5000:4320,7500:5760};
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function hookRecommendation(type, goal, hook){
  if (hook === 'win') return {title:'Keep the winner hook', copy:'Scan to see if Yo says you win', tip:'Use a simple prize, raffle, or instant fun result before the main CTA.'};
  if (hook === 'positive') return {title:'Add an action after the affirmation', copy:'Scan for a smile, then support the cause', tip:'Start with the positive message, then present one clear next step.'};
  if (type === 'booster') return {title:'Add fan participation', copy:'Scan to vote for player of the game', tip:'Voting, team trivia, or fan giveaways usually create more curiosity than “learn more.”'};
  if (type === 'nonprofit' || type === 'church') return {title:'Lead with encouragement', copy:'Scan for a message of hope', tip:'Follow the affirmation with a donation, volunteer, or mission-story CTA.'};
  if (type === 'business') return {title:'Give a useful reason to scan', copy:'Scan to claim today’s local offer', tip:'Offers, guides, giveaways, and appointment links are stronger than basic info pages.'};
  return {title:'Create a curiosity moment', copy:'Scan to unlock today’s surprise', tip:'A surprise, fortune, giveaway, or event utility can improve scan motivation.'};
}
function scoreCampaign(data){
  const base = baseline[data.campaignType];
  let score = 45;
  score += modifiers.audienceWarmth[data.audienceWarmth];
  score += modifiers.distribution[data.distribution];
  score += modifiers.hook[data.hook];
  score += modifiers.story[data.story];
  score += modifiers.timeline[data.timeline];
  if (parseInt(data.audienceSize,10) >= 1000) score += 5;
  if (data.description && data.description.trim().length > 55) score += 4;
  score = clamp(score, 25, 96);
  const scoreAdj = (score - 60) / 100;
  const scanLow = clamp(base.scan[0] + scoreAdj*8, 1, 25);
  const scanMid = clamp(base.scan[1] + scoreAdj*10, 2, 32);
  const scanHigh = clamp(base.scan[2] + scoreAdj*12, 4, 40);
  const convLow = clamp(base.conv[0] + scoreAdj*6, 1, 35);
  const convMid = clamp(base.conv[1] + scoreAdj*8, 2, 45);
  const convHigh = clamp(base.conv[2] + scoreAdj*10, 4, 60);
  const qty = qtyByAudience[data.audienceSize] || 1440;
  const scans = [scanLow, scanMid, scanHigh].map(p => Math.round(qty * p / 100));
  const actions = [convLow, convMid, convHigh].map((p,i)=> Math.round(scans[i] * p / 100));
  return {score, base, qty, scan:[scanLow,scanMid,scanHigh], conv:[convLow,convMid,convHigh], scans, actions};
}
function band(score){
  if(score >= 85) return ['Strong campaign fit','This campaign appears ready for a confident launch with the right proof and offer.'];
  if(score >= 70) return ['Good fit with improvements','This campaign has enough potential to proceed, especially if Yo improves the scan hook.'];
  if(score >= 55) return ['Promising but needs tuning','The foundation is there, but the campaign needs a stronger scan reason or distribution plan.'];
  return ['High-risk without changes','Yo recommends improving the audience plan, offer, or timeline before ordering.'];
}
document.getElementById('campaignForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    campaignType: campaignType.value,
    audienceWarmth: audienceWarmth.value,
    audienceSize: audienceSize.value,
    distribution: distribution.value,
    goal: goal.value,
    hook: hook.value,
    story: story.value,
    timeline: timeline.value,
    description: description.value
  };
  const r = scoreCampaign(data);
  const [bandTitle, bandCopy] = band(r.score);
  const rec = hookRecommendation(data.campaignType, data.goal, data.hook);
  const result = document.getElementById('results');
  result.innerHTML = `
    <div class="score-ring" style="--score:${r.score}"><span>${r.score}</span></div>
    <h3>Yo’s Campaign Readiness Score</h3>
    <p><strong>${bandTitle}.</strong> ${bandCopy}</p>
    <div class="recommendation">
      <strong>Recommended starting quantity:</strong> ${r.qty.toLocaleString()} bottles<br>
      <small>Based on audience size, campaign type, and practical pallet/case economics.</small>
    </div>
    <table class="metric-table">
      <thead><tr><th>Modeled scenario</th><th>Conservative</th><th>Moderate</th><th>Strong</th></tr></thead>
      <tbody>
        <tr><td>Scan rate</td><td>${r.scan[0].toFixed(1)}%</td><td>${r.scan[1].toFixed(1)}%</td><td>${r.scan[2].toFixed(1)}%</td></tr>
        <tr><td>Estimated scans</td><td>${r.scans[0]}</td><td>${r.scans[1]}</td><td>${r.scans[2]}</td></tr>
        <tr><td>Conversion rate</td><td>${r.conv[0].toFixed(1)}%</td><td>${r.conv[1].toFixed(1)}%</td><td>${r.conv[2].toFixed(1)}%</td></tr>
        <tr><td>Estimated actions</td><td>${r.actions[0]}</td><td>${r.actions[1]}</td><td>${r.actions[2]}</td></tr>
      </tbody>
    </table>
    <div class="recommendation">
      <strong>Yo’s scan hook upgrade:</strong> ${rec.title}<br>
      <em>Suggested label CTA: “${rec.copy}”</em><br>
      <small>${rec.tip}</small>
    </div>
    <h3>Tips to improve results</h3>
    <ul class="tip-list">
      <li>Make the first scan experience feel like a gift, not a sales pitch.</li>
      <li>Use one clear next step after the positive message, prize, vote, or offer.</li>
      <li>Have someone verbally point out the QR code when handing out bottles.</li>
      <li>Use urgency: event-only, today-only, first 100 entries, or sponsor match.</li>
      <li>Keep the mobile page short, fast, and focused on one action.</li>
    </ul>
    <p class="small-copy" style="color:#5f7281">Planning estimates only. Actual results vary based on audience, distribution, offer, timing, follow-up, and other campaign factors.</p>
    <a class="button primary full" href="#packages">Show my package options</a>
  `;
});
