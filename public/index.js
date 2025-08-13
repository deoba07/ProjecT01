const reset=document.getElementById("reset");
const submit=document.getElementById("submit");
const togglePassword = document.getElementById("togglePassword");
const passwordInput=document.getElementById("Password");

  const Username=document.getElementById("Username");
  const email=document.getElementById("email");
  const Password=document.getElementById("Password");
  const address=document.getElementById("address");
  const sor=document.getElementById("sor");
  const dob=document.getElementById("dob");
  const tel=document.getElementById("tel");
  const Male=document.getElementById("Male");
  const Female=document.getElementById("Female");
  const Single=document.getElementById("Single");
  const Married=document.getElementById("Married");
  const country=document.getElementById("country");
  const position=document.getElementById("position");
  const myp=document.getElementById("myp");
  const result=document.getElementById("result");



const usernameError=document.getElementById("usernameError");
const emailError=document.getElementById('emailError');
  const passwordError=document.getElementById("passwordError");
  const addressError=document.getElementById("addressError");
  const sorError=document.getElementById("sorError");
  const dobError=document.getElementById("dobError");
  const telError=document.getElementById("telError");
  const genderError=document.getElementById("genderError");
  const maritalError=document.getElementById("maritalError");
  const countryError=document.getElementById("countryError");
  const positionError=document.getElementById("positionError");

  const genderGroup=document.getElementById("genderGroup");
  const maritalGroup=document.getElementById("maritalGroup");
  const countryGroup=document.getElementById("countryGroup");
  const positionGroup=document.getElementById("positionGroup");
  const phoneRegex=/^\d{11}$/; 
  



submit.onclick=function(event){
  event.preventDefault();
  let isValid=true;

  result.innerText="";

  if(Username.value===""){
    Username.style.border="2px solid red";
    usernameError.innerText="Username is required";
    isValid=false;
  }else{
    Username.style.border="";
    usernameError.innerText="";
  }

  if(email.value===""){
    email.style.border="2px solid red";
    emailError.innerText="Email is required";
    isValid=false;
  }else{
    email.style.border="";
    emailError.innerText="";
  }

  if(Password.value===""){
    Password.style.border="2px solid red";
    passwordError.innerText="Password is required";
    isValid=false;
  }else{
    Password.style.border="";
    passwordError.innerText="";
  }

  if(address.value===""){
    address.style.border="2px solid red";
    addressError.innerText="Address is required";
    isValid=false;
  }else{
    address.style.border="";
    addressError.innerText="";
  }

  if(sor.value===""){
    sor.style.border="2px solid red";
    sorError.innerText="State of origin is required";
    isValid=false;
  }else{
    sor.style.border="";
    sorError.innerText="";
  }

  if(dob.value===""){
    dob.style.border="2px solid red";
    dobError.innerText="Dob is required"
    isValid=false;
  }else{
    dob.style.border="";
    dobError.innerText="";
  }

  if(tel.value.trim()===""){
    tel.style.border="2px solid red";
    telError.innerText="Phone number is required";
    isValid=false;
  }else if(!phoneRegex.test(tel.value)){
    tel.style.border="2px solid red";
    telError.innerText="Phone number must be 11 digits";
    isValid=false;
  }else{
    tel.style.border="";
    telError.innerText="";
  }

  if(!Male.checked && !Female.checked){
    genderError.innerText="Please select your gender";
    genderGroup.classList.add("invalid");
    isValid=false;
  }else{
    genderError.innerText="";
    genderGroup.classList.remove("invalid");
  }

  
  if(!Single.checked && !Married.checked){
    maritalError.innerText="Please select your marital status";
    maritalGroup.classList.add("invalid");
    isValid=false;
  }else{
    maritalError.innerText="";
    maritalGroup.classList.remove("invalid");
  }

   if(country.value === "" || country.value==="Select your country"){
    countryGroup.classList.add("invalid");
    countryError.innerText="Select your country";
    isValid=false;
  }else{
    countryGroup.classList.remove("invalid");
    countryError.innerHTML="";
  }

   if(position.value===""|| position.value==="Applying for"){
    positionGroup.classList.add("invalid");
    positionError.innerText="Please select a position";
    isValid=false;
  }else{
    positionGroup.classList.remove("invalid");
    positionError.innerText="";
  }

 if (isValid) {
  const formData = {
    username: Username.value,
    email: email.value,
    password: Password.value,
    address: address.value,
    sor: sor.value,
    dob: dob.value,
    tel: tel.value,
    gender: Male.checked ? "Male" : "Female",
    Status: Single.checked ? "Single" : "Married",
    country: country.value,
    position: position.value
  };

  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (response.ok) {
      // ✅ Backend received and processed data
      window.location.href = "thankyou.html"; // redirect only on success
    } else {
      result.innerText = "Submission failed. Try again.";
      result.style.color = "red";
    }
  })
  .catch(error => {
    console.error(error);
    result.innerText = "Network or server error.";
    result.style.color = "red";
  });
}

  
}


reset.onclick=function(){
  document.getElementById("form").reset();
  result.innerText="Form cleared!!";
  setTimeout(()=>{
    result.innerText="";
  },2000);
 } 

 
togglePassword.onclick = function () {
  const isHidden = passwordInput.getAttribute("type") === "password";
  passwordInput.setAttribute("type", isHidden ? "text" : "password");
  togglePassword.innerText = isHidden ? "Hide" : "Show";
};