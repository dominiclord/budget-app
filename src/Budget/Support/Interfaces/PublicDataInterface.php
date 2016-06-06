<?php
namespace Budget\Support\Interfaces;

/**
 * Defines a model having properties that might not be suitable to publicly display.
 * Basically limits return of data to public properties
 */
interface PublicDataInterface
{
    public function publicData(array $supplants = null);
    public function publicProperties();
}
