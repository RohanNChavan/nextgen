const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzMeHAD_PWS_g5nZjAZXcFgfeTO2idQkqVtshdusvRpHp6UgOWRgdWiUQL07onWywLQ-g/exec";

document.addEventListener("DOMContentLoaded",function(){

  document.getElementById("year").textContent=new Date().getFullYear();

  const form=document.getElementById("leadForm");
  const status=document.getElementById("statusMsg");

  document.getElementById("startBtn")?.addEventListener("click",()=>{
    document.getElementById("formSection")
      .scrollIntoView({behavior:"smooth"});
  });

  document.getElementById("navApply")?.addEventListener("click",()=>{
    document.getElementById("formSection")
      .scrollIntoView({behavior:"smooth"});
  });

  form?.addEventListener("submit",async function(e){
    e.preventDefault();

    const payload={
      fullName:fullName.value,
      mobile:mobile.value,
      email:email.value,
      employment:employment.value,
      income:income.value,
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

      status.textContent="Application submitted successfully.";
      form.reset();
    }catch{
      status.textContent="Submission failed. Please try again.";
    }
  });

  document.querySelectorAll(".faq-question").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const ans=btn.nextElementSibling;
      ans.style.display=
        ans.style.display==="block"?"none":"block";
    });
  });

});
