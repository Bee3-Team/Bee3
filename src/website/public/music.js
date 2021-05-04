async function onclickPlay(guild, user, query) {
  if (!guild) return;
  if (!user) return;
  if (!query) return;
  
  fetch(`https://beee.cf/player/play/${guild}?user=${user}&query=${query}`).then(response => {
    response.json();
  }).then(data => {
    if (!data.success) return alert(`${data.error}`);
    
    alert(`Joined ${data.voiceChannel.name}.`)
    
    return location.href = "/musicplayer?g=" + guild;
  });
}