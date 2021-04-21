
const { strictEqual } = require('assert').strict;
const BigFraction = require('./index')

strictEqual(
	new BigFraction(1045.825475).toString(),
	'41833019/40000',
	'new-float',
);
strictEqual(
	new BigFraction(1, 2).toString(),
	'1/2',
	'new-numbers',
);
strictEqual(
	new BigFraction(1n, 2n).toString(),
	'1/2',
	'new-big-numbers',
);

// equality
strictEqual(
	new BigFraction(1n, 2n).eq(
		new BigFraction(1n, 2n),
	),
	true,
	'eq-1',
);
strictEqual(
	new BigFraction(1n, 2n).eq(
		new BigFraction(2n, 4n),
	),
	true,
	'eq-2',
);

// fraction
const fraction = new BigFraction(12n, 60n);
strictEqual(
	fraction.toString(),
	'1/5',
	'fraction-string',
);
strictEqual(
	fraction.add(
		new BigFraction(1n, 60n),
	).toString(),
	'13/60',
	'fraction-add-1',
);
strictEqual(
	fraction.add(
		new BigFraction(1n, 82n),
	).toString(),
	'87/410',
	'fraction-add-2',
);
strictEqual(
	fraction.multiply(
		new BigFraction(134n, 61n),
	).toString(),
	'134/305',
	'fraction-multiply',
);
strictEqual(
	fraction.divide(
		new BigFraction(34n, 182n),
	).toString(),
	'91/85',
	'fraction-divide',
);

// really big fraction
const fraction_rly_big = new BigFraction(194736562387452879346510346507130n, 314961348765879851345n);
strictEqual(
	fraction_rly_big.toString(),
	'38947312477490575869302069301426/62992269753175970269',
	'fraction-rlybig-string',
);
