<?php

namespace Charcoal\Property;

// Local namespace dependency
use \Charcoal\Property\PropertyFactory;

/**
 * Defines a model having attributes that allow the formatting of its data.
 *
 * Complements {@see DescribableInterface}.
 */
interface DescribablePropertyInterface
{
    /**
     * Get the list of properties, as array of `PropertyInterface`
     *
     * @return array
     */
    public function properties();

    /**
     * Get a single property
     *
     * @param string $propertyIdent The ident of the property to get.
     * @return PropertyInterface
     */
    public function property($propertyIdent);

    /**
     * Alias of `property()` or `properties()`, depending if argument is set or not.
     *
     * @param mixed $propertyIdent Property ident, if null, return all properties.
     * @return array|PropertyInterface|null
     */
    public function p($propertyIdent = null);

    /**
     * @param  string  $propertyIdent The ident of the property to check.
     * @param  array   $filters       The filters to apply.
     * @return boolean False if the object doesn't match any filter, true otherwise.
     */
    public function isFiltered($propertyIdent, array $filters = null);
}
