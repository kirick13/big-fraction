
const getGCD = (x, y) => {
	const remainder = x % y;
	return (remainder === 0n) ? y : getGCD(y, remainder);
};
const getLCM = (...nums) => {
	let result = 1n;

	for (const value of nums) {
		if (1n === result) {
			result = value;
		}
		else {
			result = (result * value) / getGCD(result, value);
		}
	}

	return result;
};

const BigFraction = module.exports = function BigFraction (...args) {
	if(1 === args.length){
		const value = args[0];
		if (value instanceof BigFraction) {
			this.numerator = value.numerator;
			this.denominator = value.denominator;
		}
		else if (typeof value === 'number') {
			const fraction = String(value).split('.')[1] || '';
			const power = BigInt(fraction.length);

			this.numerator = BigInt(Math.floor(value) + fraction);
			this.denominator = 10n ** power;
		}
		else if (typeof value === 'bigint') {
			this.numerator = value;
			this.denominator = 1n;
		}
	}
	else if(2 === args.length){
		let [ numerator, denominator ] = args;

		if (typeof numerator !== 'bigint') {
			numerator = BigInt(numerator);
		}
		this.numerator = numerator;

		if (typeof denominator !== 'bigint') {
			denominator = BigInt(denominator);
		}
		this.denominator = denominator;
	}

	if (typeof this.numerator !== 'bigint') {
		throw new Error(`Invalid arguments given (${args}).`);
	}

	this.normalize();
};
BigFraction.prototype.toString = BigFraction.prototype.toJSON = function () {
	return `${this.numerator}/${this.denominator}`;
};
BigFraction.prototype.copy = BigFraction.prototype.clone = function () {
	return new BigFraction(this);
};
BigFraction.prototype.reverse = BigFraction.prototype.inv = function () {
	return new BigFraction(
		this.denominator,
		this.numerator,
	);
};
BigFraction.prototype.normalize = function () {
	const gcd = getGCD(
		this.numerator,
		this.denominator,
	);

	this.numerator /= gcd;
	this.denominator /= gcd;

	return this;
};
const TONUMBER_MULTIPLIER = 10n**20n;
BigFraction.prototype.toNumber = function () {
	const integer = this.numerator / this.denominator;
	const remainder = this.numerator % this.denominator;
	const fraction = TONUMBER_MULTIPLIER + ((remainder * TONUMBER_MULTIPLIER) / this.denominator);

	return Number(`${integer}.${String(fraction).slice(1)}`);
};

const getAdditionData = (fraction1, fraction2) => {
	const lcm = getLCM(
		fraction1.denominator,
		fraction2.denominator,
	);
	// console.log('lcm', lcm);

	return {
		numerator1: lcm / fraction1.denominator * fraction1.numerator,
		numerator2: lcm / fraction2.denominator * fraction2.numerator,
		denominator: lcm,
	};
};
BigFraction.prototype.add = function (fraction) {
	const data = getAdditionData(this, fraction);

	return new BigFraction(
		data.numerator1 + data.numerator2,
		data.denominator,
	);
};
BigFraction.prototype.subtract = BigFraction.prototype.sub = function (fraction) {
	const data = getAdditionData(this, fraction);

	return new BigFraction(
		data.numerator1 - data.numerator2,
		data.denominator,
	);
};

BigFraction.prototype.multiply = BigFraction.prototype.mul = function (fraction) {
	let numerator = 1n;
	let denominator = 1n;

	const gcd1 = getGCD(this.numerator, fraction.denominator);
	numerator *= this.numerator / gcd1;
	denominator *= fraction.denominator / gcd1;

	const gcd2 = getGCD(fraction.numerator, this.denominator);
	numerator *= fraction.numerator / gcd2;
	denominator *= this.denominator / gcd2;

	return new BigFraction(
		numerator,
		denominator,
	);
};
BigFraction.prototype.divide = BigFraction.prototype.div = function (fraction) {
	return this.multiply(
		fraction.reverse(),
	);
};

BigFraction.prototype.equals = BigFraction.prototype.eq = function (fraction) {
	this.normalize();
	fraction.normalize();

	return (this.numerator === fraction.numerator) && (this.denominator === fraction.denominator);
};
