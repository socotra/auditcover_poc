const { getExposureCharacteristics, getPerilCharacteristics } = require("../../lib/utility");


function getPerilRates(data) {
  const { policy, policyExposurePerils, quoteLocator } = data;
  const workingPerils = [];

  /**
   * Loop through each location to calculate PD and BI premiums.
   */
  policy.exposures
    .filter((e) => e.name === "location")
    .forEach((exposure) => {
      const exposureCh = getExposureCharacteristics(exposure, policyExposurePerils);

      /**
       * Calculate Property Damage gross premiums
       */
      const pdRate = parseFloat(policy.characteristics[0].fieldValues.pdProposedRenewalRate[0]);
      exposure.perils
        .filter((p) => p.characteristics[0].fieldValues.type_ext?.[0] === PD)
        .forEach((peril) => {
          const perilCh = getPerilCharacteristics(peril, policyExposurePerils);
          const sumInsured = parseFloat(perilCh.fieldValues.sumInsured_ext[0]);
          const yearlyPremium = ((sumInsured * pdRate) / 100).toFixed(2);
          workingPerils.push({
            chLocator: perilCh.locator,
            type: PD,
            yearlyPremium,
          });
        });

      /**
       * Calculate Business Interruption gross premiums
       */
      const biRate = parseFloat(policy.characteristics[0].fieldValues.biProposedRenewalRate[0]);
      exposure.perils
        .filter((p) => p.characteristics[0].fieldValues.type_ext?.[0] === BI)
        .forEach((peril) => {
          const perilCh = getPerilCharacteristics(peril, policyExposurePerils);
          const sumInsured = parseFloat(perilCh.fieldValues.sumInsured_ext[0]);
          const yearlyPremium = ((sumInsured * biRate) / 100).toFixed(2);
          workingPerils.push({
            chLocator: perilCh.locator,
            type: BI,
            yearlyPremium,
          });
        });
    });

  /**
   * Sample table lookup with currency tables
   * Converting Gross Premium to USD
   */
  const policyCurrency = policy.currency;
  const grossPremium = workingPerils
    .map((p) => parseFloat(p.yearlyPremium))
    .reduce((p, v) => p + v, 0)
    .toFixed(2);

  const fxRateString = socotraApi.tableLookup(0, "fx_rates", policyCurrency);
  const fxRate = parseFloat(fxRateString);

  const grossPremiumUSD = grossPremium / fxRate;

  /**
   * Saving gross premium in USD to AuxData.
   * An unrestricted json object data storage
   */
  socotraApi.setAuxData(quoteLocator, "grossPremiumUSD", grossPremiumUSD.toFixed(2));

  /**
   * Composing and returning Socotra Premium Object
   */
  const pricedPerilCharacteristics = {};
  workingPerils.forEach((p) => {
    pricedPerilCharacteristics[p.chLocator] = {
      yearlyPremium: p.yearlyPremium,
    };
  });
  return { pricedPerilCharacteristics };
}

exports.getPerilRates = getPerilRates;
