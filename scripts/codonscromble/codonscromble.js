function codonsToDNA() {
  var dict = JSON.parse(document.getElementById("codondict").value);
  var input = document.getElementById("codons").value.replace(/[\s\d]/g,"");
  input = input.toUpperCase();
  var out = "";
  var as = 0;
  var cs = 0;
  var ts = 0;
  var gs = 0;
  for (var i=0; i < input.length; i++) {
    if (!(input[i] in dict)) {
      alert("The character \"" + input[i] + "\" at position " + i + " is invalid.");
      return;
    }
    var choices = dict[input[i]];
    var chnum = Math.floor(Math.random() * choices.length);

    out += choices[chnum];
    for (var j=0; j < choices[chnum].length; j++) {
      if (choices[chnum][j] == 'a') { as++; }
      if (choices[chnum][j] == 'c') { cs++; }
      if (choices[chnum][j] == 't') { ts++; }
      if (choices[chnum][j] == 'g') { gs++; }
    }
  }
  document.getElementById("DNA").value = out;

  var analytics = "<table><tr><td>Letter</td>"
    + "<td>Occourences</td></tr><tr><td>a</td><td>" + as + "</td></tr>"
    + "<tr><td>c</td><td>" + cs + "</td></tr><tr><td>t</td><td>"
    + ts + "</td></tr><tr><td>g</td><td>" + gs + "</td></tr></table>"
    + "<p>GC ratio: " + ((gs + cs)/(as+ts+gs+cs) * 100) + "%</p>";
  document.getElementById("analytics").innerHTML = analytics; 
}

function DNAToCodons() {
  var dict = JSON.parse(document.getElementById("codondict").value);
  var input = document.getElementById("DNA").value.replace(/[\s\d]/g,"");
  input = input.toLowerCase();
  var out = "";
  for (var i=0; i < input.length; i++) {
    if (input[i] < "0" || input[i] > "9") {
      if (!"actg".includes(input[i])) {
        alert("The character \"" + input[i] + "\" at position " + i + " is invalid.");
        return;
      }
    }
  }
  for (var i=0; i < input.length; i+=3) {
    if (input[i] < "0" || input[i] > "9") {
      var t = "" + input[i] + input[i+1] + input[i+2];
      var c = undefined;
      for (codon in dict) {
        for (triplet in dict[codon]) {
          if (t == dict[codon][triplet]) {
            c = codon;
          }
        }
      }
      if (c == undefined) {
        //we have not found any codon for the DNA triplet
        alert("The DNA triplet \"" + t + "\" at position " + i + "is invalid.");
        return;
      }

      out += c;
    }
  }
  document.getElementById("codons").value = out;
  document.getElementById("analytics").innerHTML = "";
}

function checkForRepeats() {
  var analytics = "<table><tr><td>Sequence</td><td>Occourences</td></tr>";
  var dna = document.getElementById("DNA").value.replace(/[\s\d]/g,"");
  var minrep = parseInt(document.getElementById("minrep").value);
  var maxrep = parseInt(document.getElementById("maxrep").value);

  var repDict = {}; //count the repetitions of all occourances 10+bp long
  for (var r = maxrep; r >= minrep; r--) {
    //dna.length/2 is picked as things have to repeat at least twice.
    for (var i = 0; i + r <= dna.length; i++) {
      let selection = dna.slice(i, i + r);
      //increment the count of the selection
      if (repDict[selection] == undefined) {
        repDict[selection] = 1;
      } else {
        repDict[selection] += 1;
      }
    }
    for (sequence in repDict) {
      //delete all sequences that do not repeat
      if (repDict[sequence] == 1) {
        delete repDict[sequence];
      }
    }
  }
  for (sequence in repDict) {
    if (repDict[sequence] > 1) {
      //list in analytics table
      analytics += "<tr><td>" + sequence + "</td><td>" + repDict[sequence]
        + "</td></tr>";
    }
  }
  analytics += "</table>";
    
  document.getElementById("repeats").innerHTML = analytics; 
}
