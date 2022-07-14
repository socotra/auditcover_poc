/******************************************************************
 * Utility functions
 ******************************************************************/

function getExposureCharacteristics(exposure, policyExposurePerils) {
  return exposure.characteristics.find((ch) => policyExposurePerils.findIndex((pep) => pep.exposureCharacteristicsLocator === ch.locator) >= 0);
}

function getPerilCharacteristics(peril, policyExposurePerils) {
  return peril.characteristics.find((ch) => policyExposurePerils.findIndex((pep) => pep.perilCharacteristicsLocator === ch.locator) >= 0);
}

exports.getExposureCharacteristics = getExposureCharacteristics;
exports.getPerilCharacteristics = getPerilCharacteristics;

