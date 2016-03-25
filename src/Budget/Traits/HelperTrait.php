<?php
namespace Budget\Traits;


// From `charcoal-base`
use \Charcoal\Loader\CollectionLoader;
use \Charcoal\Model\ModelFactory;

// From `charcoal-core`
use \Charcoal\Translation\TranslationString;


/**
 * Helper
 * Basic helper to handle all charcoal methods
 * easily and the same way throughout the website
 *
 */
trait HelperTrait
{
	protected $modelFactory;
	protected $loader;

	/**
	 * @var TranslationString $translator
	 */
	protected $translator;

	/**
	 * Protos to be kept in an associative array
	 * @var array $proto
	 */
	protected $proto = [];

    /**
     * @return ModelFactory
     */
    public function modelFactory()
    {
        if ($this->modelFactory === null) {
            $this->modelFactory = new ModelFactory();
        }
        return $this->modelFactory;
    }

    /**
     * Returns a model prototype
     * Not to be used when calling multiple object
     * instances.
     *
     * @param  [type] $objType [description]
     * @return [type]          [description]
     */
    public function proto($objType)
    {
    	if (isset($this->proto[$objType])) {
    		return $this->proto[$objType];
    	}

    	$this->proto[$objType] = $this->obj($objType);

        return $this->proto[$objType];
    }

    /**
     * Return new instance of objType no matter what
     *
     * @param  string $objType
     * @return {$objType}
     */
    public function obj($objType)
    {
    	$factory = $this->modelFactory();
    	$obj = $factory->create($objType, [
            'logger'=>$this->logger
        ]);
    	return $obj;
    }

    /**
     * @param string $objType
     * @return CollectionLoader
     */
    public function collection($objType)
    {
        $obj = $this->obj($objType);
        $loader = new CollectionLoader([
            'logger'=>$this->logger
        ]);
        $loader->setModel($obj);
        return $loader;
    }

    /**
     * Used for copyrights
     * @return string
     */
    public function currentYear()
    {
        return date('Y');
    }

}
