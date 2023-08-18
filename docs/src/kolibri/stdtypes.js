/**
 * @module stdtypes
 * The js doc definitions of the types that are most commonly used.
 */

/**
 * @typedef { <_T_> (...x) => _T_ } ProducerType
 * A function that takes arbitrary arguments (possibly none) and produces a value of type _T_.
 */

/**
 * @typedef { <_T_> (_T_) => void } ConsumerType
 * A function that consumes a value of type _T_ and returns nothing.
 */

/**
 * @typedef { <_T_> (_T_) => Boolean } ConsumingPredicateType
 * A function that consumes a value of type _T_ and returns a Boolean.
 */

/**
 * @typedef { <_T_>  (_T_) => _T_ } UnaryOperatorType
 * A unary operator on _T_.
 */
