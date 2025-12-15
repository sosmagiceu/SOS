
document.querySelectorAll('[data-carousel]').forEach(c=>{
  let i=0, track=c.querySelector('.tm-carousel__track');
  setInterval(()=>{i=(i+1)%5;track.style.transform=`translateX(${-i*100}%)`},3000);
});
