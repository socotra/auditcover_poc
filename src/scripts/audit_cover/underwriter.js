export function getUnderwritingResult(data) {
  
  let decision = "";
  let notes = []
  let refer = false
  let decline = false
  for (const pep of data.policy.exposures){
    let anzsicCode = pep.characteristics[0].fieldValues.anzsic_code_ext[0];
    let locationName = pep.characteristics[0].fieldValues.name_ext[0];
    let uwDesc = socotraApi.tableLookup(0, "anzsic_uw", anzsicCode);
    if(uwDesc === 'Decline'){
      decline = true;
    }
    if(uwDesc === 'Refer'){
      refer = true;
    }
    notes.push("code: " + anzsicCode + " locName: " + locationName  +  " uwDesc: " + uwDesc)
  }

  if (refer == true){
    decision = "none";
  }else if (decline == true){
    decision = "reject";
  }else {
    decision = "accept"
  }

  return {
    decision: decision,
    notes: notes,
  };
}
