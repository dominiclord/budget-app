<?php

namespace Charcoal\Model;

// Dependencies from `PHP`
use \InvalidArgumentException;
use \ArrayAccess;
use \ArrayIterator;
use \Countable;
use \IteratorAggregate;

// Local namespace dependencies
use \Charcoal\Model\CollectionInterface;
use \Charcoal\Model\ModelInterface;

/**
 * Model Collection. An Iterator of ModelInterface.
 *
 * Typically, the Model Collection will be used to hold the result of a "CollectionLoader".
 *
 */
class Collection implements
    CollectionInterface,
    ArrayAccess,
    Countable,
    IteratorAggregate
{
    /**
     * Array of (ordered) objects
     * @var array $objects
     */
    private $objects = [];

    /**
     * Array of (ordered) objects with limited to public scope properties
     * @var array $objects
     */
    private $objectsPublic = [];

    /**
     * Identity Map
     *
     * Ensures that each object gets loaded only once by keeping
     * every loaded object in a map. Looks up objects using the
     * map when referring to them.
     * @var array $map
     */
    private $map = [];

    /**
     * ArrayAccess > offsetSet
     *
     * Note that collection does not support setting object to a specific key
     * (The object's ID is always used for this).
     *
     * @param mixed $offset The array offset to set.
     * @param mixed $value  The value to set.
     * @throws InvalidArgumentException If the value is not a Object or offset is set.
     * @return void
     */
    public function offsetSet($offset, $value)
    {
        if (!($value instanceof ModelInterface)) {
            throw new InvalidArgumentException(
                'Collection value must be a ModelInterface object.'
            );
        }
        if ($offset === null) {
            $this->objects[] = $value;
            $this->map[$value->id()] = $value;
        } else {
            throw new InvalidArgumentException(
                'Collection value can be set like an array.'
            );
        }
    }

    /**
     * ArrayAccess > offsetExists
     *
     * @param  mixed $offset The array offset to check.
     * @return boolean
     */
    public function offsetExists($offset)
    {
        if (is_int($offset)) {
            return isset($this->objects[$offset]);
        } elseif (is_string($offset)) {
            return isset($this->map[$offset]);
        }
    }

    /**
     * ArrayAccess > offsetUnset
     *
     * @param mixed $offset The array offset to unset.
     * @throws InvalidArgumentException If the offset is not an integer or string.
     * @return void
     */
    public function offsetUnset($offset)
    {
        if (is_int($offset)) {
            $id = $this->objects[$offset]->id();
            unset($this->objects[$offset]);
            unset($this->map[$id]);
        } elseif (is_string($offset)) {
            $pos = $this->pos($offset);
            unset($this->map[$offset]);
            unset($this->objects[$pos]);
        } else {
            throw new InvalidArgumentException(
                'Offset should be either an integer or a string.'
            );
        }
    }

    /**
     * ArrayAccess > offsetGet
     *
     * @param mixed $offset The array offset to get.
     * @throws InvalidArgumentException If the offset is not an integer or string.
     * @return mixed
     */
    public function offsetGet($offset)
    {
        if (is_int($offset)) {
            return (isset($this->objects[$offset]) ? $this->objects[$offset] : null);
        } elseif (is_string($offset)) {
            return (isset($this->map[$offset]) ? $this->map[$offset] : null);
        } else {
            throw new InvalidArgumentException(
                'Offset should be either an integer or a string.'
            );
        }
    }

    /**
     * IteratorAggregate > getIterator
     *
     * By implementint the IteratorAggregate interface, Collection lists can be
     *
     *
     * @return mixed
     */
    public function getIterator()
    {
        if (empty($this->map)) {
            // Empty object
            return new ArrayIterator();
        }
        return new ArrayIterator($this->map);
    }

    /**
     * Countable > count
     *
     * By implementing the Countable interface, the PHP `count()` function
     * can be called directly on a Collection.
     *
     * @return integer The number of objects in the Collection.
     */
    public function count()
    {
        return count($this->objects);
    }

    /**
     * Get the ordered object array.
     *
     * @return array
     */
    public function objects()
    {
        return $this->objects;
    }

    /**
     * Get the ordered object array, with objects limited to public scope properties
     * @return array
     */
    public function objectsPublic()
    {
        if (!$this->objectsPublic) {
            $objects = [];
            foreach ($this->objects as $obj) {
                $objects[] = $obj->publicData();
            }
            $this->objectsPublic = $objects;
        }
        return $this->objectsPublic;
    }

    /**
     * Get the map array, with IDs as keys.
     *
     * @return array
     */
    public function map()
    {
        return $this->map;
    }

    /**
     * Manually add an object to the list
     *
     * @param ModelInterface $obj The object to add.
     * @return \Charcoal\Collection (Chainable)
     */
    public function add(ModelInterface $obj)
    {
        $this->objects[] = $obj;
        $this->map[$obj->id()] = $obj;

        // Chainable
        return $this;
    }

    /**
     * @param string|ModelInterface $key The key to retrieve the position from.
     * @throws InvalidArgumentException If the offset is not a string.
     * @return integer|boolean
     */
    public function pos($key)
    {
        if (is_string($key)) {
            return array_search($key, array_keys($this->map));
        } elseif ($key instanceof ModelInterface) {
            return array_search($key->id(), array_keys($this->map));
        } else {
            throw new InvalidArgumentException(
                'Key must be a string or an ModelInterface object.'
            );
        }
    }
}
