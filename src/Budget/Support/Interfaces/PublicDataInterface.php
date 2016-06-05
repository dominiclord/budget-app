<?php
namespace Budget\Support\Interfaces;

/**
 * Defines a model having properties that might not be suitable to display publically.
 * Allows limiting return of data to public properties
 */
interface PublicDataInterface
{
    public function publicData();
    public function publicProperties();
}
