(function(){
  const form = document.getElementById('quiz');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect 12 answers
    const selects = [...form.querySelectorAll('select')];
    const values = selects.map(s => Number(s.value || 0));
    const total = values.reduce((a,b)=>a+b,0);
    const max = values.length * 5;
    const score = Math.round((total / max) * 100); // 0..100

    const band = score >= 85 ? 'Ready'
              : score >= 70 ? 'Moderate Risk'
              : score >= 50 ? 'Elevated Risk'
              : 'High Risk';

    // Org metadata
    const org  = (document.getElementById('org').value || 'HIPAA Client').trim();
    const email= (document.getElementById('email').value || '').trim();
    const role = (document.getElementById('role').value || '').trim();

    // OPTIONAL: Post to Make.com
    const MAKE_WEBHOOK = "https://hook.eu1.make.com/your-webhook-id"; // <-- replace with your webhook
    if (MAKE_WEBHOOK && MAKE_WEBHOOK.includes('make.com')) {
      try {
        await fetch(MAKE_WEBHOOK, {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({
            type: "hipaa_assessment",
            score, band, answers: values, org, email, role,
            date: new Date().toISOString(),
            page: location.href
          })
        });
      } catch(err){
        console.warn('Webhook failed (continuing to report):', err);
      }
    }

    // Redirect to the HIPAA report with score + org
    const q = new URLSearchParams({ org, score: String(score) }).toString();
    window.location.href = `/reports_hipaa/hipaa_gap_report_xyberiq.html?${q}`;
  });
})();
