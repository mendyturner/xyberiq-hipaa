document.getElementById('hipaaForm').addEventListener('submit', e => {
  e.preventDefault();
  const values = [...e.target.querySelectorAll('select')].map(s => Number(s.value || 0));
  const total = values.reduce((a,b)=>a+b,0);
  const max = values.length * 5;
  const score = Math.round((total / max) * 100);

  // optional: send to Make.com webhook
  const MAKE_WEBHOOK = "https://hook.eu1.make.com/your-webhook-id"; // <-- replace this
  fetch(MAKE_WEBHOOK, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      type: "hipaa_assessment",
      score,
      answers: values,
      date: new Date().toISOString()
    })
  }).catch(console.error);

  // redirect to report with score + org if desired
  const org = encodeURIComponent("Startup Client");
  window.location.href = `/reports_hipaa/hipaa_gap_report_xyberiq.html?score=${score}&org=${org}`;
});
