<?php
namespace Budget\Support\Traits;

/**
 * Default implementation, as trait, of the {@see PublicDataInterface}.
 */
trait PublicDataTrait
{
    /**
     * Public properties for object
     * Stored only once if used on multiple class instances
     * @var array $proto
     */
    public static $publicProperties = [];

    /**
     * Return the object data as an array
     * Filters returned properties according to $this->publicProperties
     * Allows replacing data with an alias value (ex.: category name instead of category id)
     *
     * @param  array  $aliases  Array of aliases and their values to replace default public data
     * @return array
     */
    public function publicData(array $aliases = null)
    {
        $properties = array_keys($this->metadata()->properties());
        $publicProperties = $this->publicProperties();
        $filteredProperties = array_merge(array_diff($properties, $publicProperties), array_diff($publicProperties, $properties));

        $data = $this->data($filteredProperties);

        if ($aliases !== null) {
            foreach($aliases as $ident => $value) {
                if (!empty($data[$ident])) {
                    $data[$ident] = $value;
                }
            }
        }

        return $data;
    }

    /**
     * Return a model's public properties
     * @return array
     */
    public function publicProperties()
    {
        if (!self::$publicProperties) {
            $publicProperties = (isset($this->metadata()->public_properties)) ? $this->metadata()->public_properties : $this->metadata()->properties();
            self::$publicProperties = $publicProperties;
        }
        return self::$publicProperties;
    }
}
