export function errorHandler(message: any, source?: any, lineno?: any, colno?: any, error?: any, showAlert=true) {
  if (showAlert)
    alert(message)

  const errorEl = document.getElementById("error")

  if (errorEl) {
    errorEl.style.display = "block"
    errorEl.innerHTML = message + "<br/>" + "Line: " + lineno + "<br/>" + source
  }
  
  return true
}
