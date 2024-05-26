for (const box of document.querySelectorAll('.box'))
{
    box.onmousemove = (e) =>
    {
        const { currentTarget : target} = e;

        const rect = target.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        
        target.style.setProperty("--mouse-x" , `${x}px`);
        target.style.setProperty("--mouse-y" , `${y}px`);
    }
}
let links = document.querySelectorAll(".link");
for (let link of links)
{
    link.addEventListener("click", function(event) {
        let inputValue = document.getElementById("name").value;
        if (inputValue === "")
        {
           alert("Enter player name");
           event.preventDefault();
    
        }
        this.href = this.href + "?data=" + encodeURIComponent(inputValue);
      });
}



