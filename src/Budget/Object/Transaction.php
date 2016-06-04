<?php

namespace Budget\Object;

use \DateTime;
use \Exception;
use \InvalidArgumentException;

use \Pimple\Container;

// Dependencies from `charcoal-core`
use \Charcoal\Model\AbstractModel;

use \Budget\Object\TransactionCategory;

class Transaction extends AbstractModel {

    protected $active = true;
    protected $type;
    protected $amount;
    protected $category;
    protected $description;
    protected $creationDate;
    protected $modifiedDate;

    /** Getters */
    public function active() { return $this->active; }
    public function type() { return $this->type; }
    public function amount() { return $this->amount; }
    public function category() { return $this->category; }
    public function description() { return $this->description; }
    public function creationDate() { return $this->creationDate; }
    public function modifiedDate() { return $this->modifiedDate; }

    /** Setters */
    public function setActive($active)
    {
        $this->active = $active;
        return $this;
    }
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }
    public function setAmount($amount)
    {
        $this->amount = $amount;
        return $this;
    }
    public function setCategory($category)
    {
        $this->category = $category;
        return $this;
    }
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }
    public function setCreationDate($creationDate)
    {
        $this->creationDate = $creationDate;
        return $this;
    }
    public function setModifiedDate($modifiedDate)
    {
        $this->modifiedDate = $modifiedDate;
        return $this;
    }
}