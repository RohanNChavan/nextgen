const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzMeHAD_PWS_g5nZjAZXcFgfeTO2idQkqVtshdusvRpHp6UgOWRgdWiUQL07onWywLQ-g/exec";

document.addEventListener("DOMContentLoaded",function(){

  const formWrapper=document.getElementById("formWrapper");

  document.getElementById("startBtn")?.addEventListener("click",()=>{
    formWrapper.classList.add("active");
    formWrapper.scrollIntoView({behavior:"smooth"});
  });

  document.getElementById("navApply")?.addEventListener("click",()=>{
    formWrapper.classList.add("active");
  });

  document.getElementById("closeForm")?.addEventListener("click",()=>{
    formWrapper.classList.remove("active");
  });

  /* SCROLL REVEAL */
  const reveals=document.querySelectorAll(".reveal");
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add("active");
    });
  },{threshold:0.2});
  reveals.forEach(r=>observer.observe(r));

  /* FAQ */
  document.querySelectorAll(".faq-question").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const answer=btn.nextElementSibling;
      answer.style.display=answer.style.display==="block"?"none":"block";
    });
  });

  /* SUBMIT */
  const form=document.getElementById("leadForm");
  form?.addEventListener("submit",async e=>{
    e.preventDefault();
    const status=document.getElementById("statusMsg");

    const payload={
      fullName:fullName.value,
      email:email.value,
      phone:phone.value,
      pan:pan.value,
      monthlyIncome:monthlyIncome.value,
      loanAmount:loanAmount.value,
      page:window.location.href,
      source:"loangalaxy"
    };

    try{
      await fetch(GOOGLE_SCRIPT_URL,{
        method:"POST",
        mode:"no-cors",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(payload)
      });
      status.textContent="Submitted successfully!";
      form.reset();
    }catch{
      status.textContent="Submission failed.";
    }
  });

});
