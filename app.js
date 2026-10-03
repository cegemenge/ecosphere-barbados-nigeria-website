const amountInput = document.querySelector('#amount');
const currencyInput = document.querySelector('#currency');
const rateInput = document.querySelector('#rate');
const symbol = document.querySelector('#currency-symbol');
const hint = document.querySelector('#currency-hint');
const payout = document.querySelector('#payout');
const breakdown = document.querySelector('#breakdown');
const grossOutput = document.querySelector('#gross');
const feeOutput = document.querySelector('#fee');
const feeLabel = document.querySelector('#fee-label');
const quoteButton = document.querySelector('#quote-button');

const formatNumber = value => new Intl.NumberFormat('en-NG', {
  maximumFractionDigits: 2
}).format(value);

const formatNaira = value => `₦${formatNumber(value)}`;
const formatUsd = value => `US$${formatNumber(value)}`;

function disableQuote() {
  quoteButton.href = '#';
  quoteButton.setAttribute('aria-disabled', 'true');
  quoteButton.classList.add('quote-disabled');
}

function updateEstimate() {
  const amount = Number(amountInput.value);
  const rate = Number(rateInput.value);
  const currency = currencyInput.value;
  const feePercent = 0.04;

  symbol.textContent = currency === 'USD' ? '$' : 'Bds$';
  hint.textContent = `${currency} cash · ${feePercent * 100}% service fee`;
  feeLabel.textContent = `Service fee (${feePercent * 100}%, in USD)`;

  if (!Number.isFinite(amount) || amount <= 0) {
    payout.textContent = 'Enter your cash amount';
    payout.classList.add('muted');
    breakdown.hidden = true;
    disableQuote();
    return;
  }

  if (!Number.isFinite(rate) || rate <= 0) {
    payout.textContent = 'Enter the CBN rate';
    payout.classList.add('muted');
    breakdown.hidden = true;
    disableQuote();
    return;
  }

  const usdEquivalent = currency === 'BBD' ? amount / 2 : amount;
  const gross = usdEquivalent * rate;
  const feeUsd = usdEquivalent * feePercent;
  const feeNgn = feeUsd * rate;
  const net = gross - feeNgn;

  payout.textContent = formatNaira(net);
  payout.classList.remove('muted');
  grossOutput.textContent = formatNaira(gross);
  feeOutput.textContent = `− ${formatUsd(feeUsd)}`;
  breakdown.hidden = false;

  const message = [
    'Hello, I used the ECOSPHERE website payout estimator.',
    `Cash amount: ${formatNumber(amount)} ${currency}`,
    `USD/NGN rate entered: ${formatNaira(rate)} per US$1 (from CBN)`,
    `Estimated amount before fee: ${formatNaira(gross)}`,
    `Service fee (${feePercent * 100}%): ${formatUsd(feeUsd)}`,
    `Estimated fee equivalent at entered rate: ${formatNaira(feeNgn)}`,
    `Estimated naira payout: ${formatNaira(net)}`,
    'Please confirm the current rate, availability and payout instructions.'
  ].join('\n');

  quoteButton.href = `https://wa.me/12462617204?text=${encodeURIComponent(message)}`;
  quoteButton.setAttribute('aria-disabled', 'false');
  quoteButton.classList.remove('quote-disabled');
}

amountInput.addEventListener('input', updateEstimate);
currencyInput.addEventListener('change', updateEstimate);
rateInput.addEventListener('input', updateEstimate);
document.querySelector('#year').textContent = new Date().getFullYear();

quoteButton.addEventListener('click', event => {
  if (quoteButton.getAttribute('aria-disabled') === 'true') event.preventDefault();
});

updateEstimate();
