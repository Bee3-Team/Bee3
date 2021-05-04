async function onclickPlay(guild, user, query) {
  if (!guild) return;
  if (!user) return;
  if (!query) return;
  
  fetch(`/player/play/${guild.toString()}?user=${user.toString()}&query=${query.toString()}`).then(response => {
    response.json();
  }).then(data => {
    if (!data.success) return alert(`${data.error}`);
    
    alert(`Joined ${data.voiceChannel.name}.`)
    
    return location.href = "/musicplayer?g=" + guild;
  });
}