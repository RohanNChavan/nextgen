document.addEventListener("DOMContentLoaded",function(){

  const startBtn=document.getElementById("startBtn");
  const navApply=document.getElementById("navApply");
  const closeForm=document.getElementById("closeForm");
  const stickyApply=document.getElementById("stickyApply");
  const formWrapper=document.getElementById("formWrapper");

  function openForm(){
    formWrapper.classList.add("active");
    formWrapper.scrollIntoView({behavior:"smooth"});
  }

  startBtn?.addEventListener("click",openForm);
  navApply?.addEventListener("click",openForm);
  stickyApply?.addEventListener("click",openForm);
  closeForm?.addEventListener("click",()=>formWrapper.classList.remove("active"));

  /* COUNTERS */
  const counters=document.querySelectorAll(".counter");
  counters.forEach(counter=>{
    const target=+counter.getAttribute("data-target");
    let count=0;
    const update=()=>{
      count+=Math.ceil(target/50);
      if(count<target){
        counter.textContent=count;
        requestAnimationFrame(update);
      }else{
        counter.textContent=target+"+";
      }
    };
    update();
  });

  /* TESTIMONIAL SLIDER */
  let index=0;
  const testimonials=document.querySelectorAll(".testimonial");
  setInterval(()=>{
    testimonials[index].classList.remove("active");
    index=(index+1)%testimonials.length;
    testimonials[index].classList.add("active");
  },4000);

});
