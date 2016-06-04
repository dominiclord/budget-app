<?php

namespace Pomerleau\Object;

use \Pimple\Container;

// Dependencies from `charcoal-base`
// Configurable, indexable
use \Charcoal\Object\Content;

use \Charcoal\Cms\Interfaces\AttachmentAwareInterface;
use \Charcoal\Cms\Traits\AttachmentAwareTrait;

// Model Aware
use Pomerleau\Support\Traits\ModelAwareTrait;
use Pomerleau\Support\Interfaces\ModelAwareInterface;

// Translation Aware
use Pomerleau\Support\Traits\TranslationAwareTrait;
use Pomerleau\Support\Interfaces\TranslationAwareInterface;

// Translation Aware
use Pomerleau\Support\Traits\HelperAwareTrait;
use Pomerleau\Support\Interfaces\HelperAwareInterface;

/**
 * Project class
 * A project could be a civil work or a building.
 *
 */
class Project extends Content implements
	AttachmentAwareInterface,
	TranslationAwareInterface,
	ModelAwareInterface,
	HelperAwareInterface
{
	use AttachmentAwareTrait;
	use TranslationAwareTrait;
	use ModelAwareTrait;
	use HelperAwareTrait;

	/**
	 * Base
	 * @var ID
	 * @var Boolean
	 * @var Integer
	 */
	protected $id;
	protected $active;
	protected $position;

	/**
	 * Name of the project
	 * @l10n
	 * @var String $name
	 */
	protected $name;

	/**
	 * Title of the project
	 * @l10n
	 * @var String $title
	 */
	protected $title;


	/**
	 * Description of the project
	 * @l10n
	 * @var string $description
	 */
	protected $description;

	/**
	 * Challenges concerning the project
	 * @l10n
	 * @multiple
	 * @var String $challenges
	 */
	protected $challenges;

	/**
	 * Awards, text (html) field
	 * @l10n
	 * @var string $awards Awards list & details
	 */
	protected $awards;

	/**
	 * Choice between Buildings and Civil works
	 * @choice
	 * @var string $type
	 */
	protected $type;

	/**
	 * Client object
	 * @var pomerleau/object/client $client
	 */
	protected $client;

	/**
	 * Category of project
	 * Offices, commercial, educational....
	 * @multiple
	 * @var pomerleau/object/project-category
	 */
	protected $categories;

	/**
	 * Location of the project (address)
	 *
	 * @var string [l10n?] $location
	 */
	protected $location;

	/**
	 * Area covered by the project
	 * Probably in KM
	 *
	 * @var string $area no reason to have this l10n
	 */
	protected $area;

	/**
	 * Year of constructin
	 * Could be a single year, or something like
	 * 2008-2012, which is why it is a string
	 *
	 * @var String $year
	 */
	protected $year;

	/**
	 * Services related to the project
	 *
	 * @multiple
	 * @var pomerleau/object/service
	 */
	protected $services;

	/**
	 * Tags of the project
	 * Easier for reseach purpose
	 *
	 * @multiple
	 * @var pomerleau/object/tag
	 */
	protected $tags;

	/**
	 * Main project image
	 * Header image
	 *
	 * @format -> @todo
	 * @var image $image
	 */
	protected $headerImage;

	/**
	 * Main project image
	 *
	 * @format -> @todo
	 * @var image $image
	 */
	protected $image;

	/**
	 * Main project thumbnail
	 * Displayed in the project list
	 *
	 * @format  -> @todo
	 * @var image $thumbnail
	 */
	protected $thumbnail;

	/**
	 * Related objects
	 *
	 * @var Collection $tagsCollection pomerleau/object/tag
	 * @var Collection $servicesCollection pomerleau/object/service
	 * @var Object $clientObject pomerleau/object/client
	 */
	private $tagsCollection;
	private $servicesCollection;
	private $clientObject;
	private $categoriesCollection;

	/**
	 * Don't split more than once.
	 * @var array
	 */
	private $challengesList;

	public function setDependencies(Container $container)
	{
		$this->setModelFactory($container['model/factory']);
		$this->setHelper($container['pomerleau/helper']);
	}

	/**
	 * Collection of tags
	 * @return Collection pomerleau/object/tag-------------------------------+
	 */
	public function tagsCollection()
	{
		if ($this->tagsCollection) {
			return $this->tagsCollection;
		}

		if (!$this->tags()) {
			return false;
		}

		$loader = $this->collection('pomerleau/object/tag');
		$loader->addFilter('active', true);
		$loader->addFilter([
            'property' => 'id',
            'val' => $this->tags(),
            'operator' => 'IN'
        ]);

        $this->tagsCollection = $loader->load();

        return $this->tagsCollection;
	}

	public function tagsToArray()
	{
		$tags = $this->tagsCollection();

		if (!$tags) {
			return false;
		}

		$output = [];
		foreach ($tags as $s) {
			$output[] = $s->name()->val();
		}
		return $output;
	}

	/**
	 * @see project-details.mustache
	 * @return Array of tags label
	 */
	public function tagsToString()
	{
		$output = $this->tagsToArray();
		return implode(', ', $output);
	}


	/**
	 * Collection of services
	 * @return Collection pomerleau/object/service
	 */
	public function servicesCollection()
	{
		if ($this->servicesCollection) {
			return $this->servicesCollection;
		}

		if (!$this->services()) {
			return false;
		}

		$loader = $this->collection('pomerleau/object/service');
		$loader->addFilter('active', true);
		$loader->addFilter([
            'property' => 'id',
            'val' => $this->services(),
            'operator' => 'IN'
        ]);

        $this->servicesCollection = $loader->load();

        return $this->servicesCollection;
	}

	/**
	 * @see project-details.mustache
	 * @return Array Services.
	 */
	public function servicesToArray()
	{
		$services = $this->servicesCollection();

		if (!$services) {
			return false;
		}

		$output = [];
		foreach ($services as $s) {
			$output[] = $s->name()->val();
		}
		return $output;
	}

	/**
	 * @see project-details.mustache
	 * @return String Exploded services.
	 */
	public function servicesToString()
	{
		$output = $this->servicesToArray();
		return implode(', ', $output);
	}

	/**
	 * Client object
	 *
	 * @return pomerleau/object/client Always a client object
	 */
	public function clientObject()
	{
		if (!$this->client()) {
			return $this->obj('pomerleau/object/client');
		}
		if ($this->clientObject) {
			return $this->clientObject;
		}

		$this->clientObject = $this->obj('pomerleau/object/client');
		$this->clientObject->load($this->client());

		return $this->clientObject;
	}

	/**
	 * Collection of categories
	 * @return Collection pomerleau/object/service
	 */
	public function categoriesCollection()
	{
		if ($this->categoriesCollection) {
			return $this->categoriesCollection;
		}

		if (!$this->categories()) {
			return false;
		}

		$loader = $this->collection('pomerleau/object/project-category');
		$loader->addFilter('active', true);
		$loader->addFilter([
            'property' => 'id',
            'val' => $this->categories(),
            'operator' => 'IN'
        ]);

        $this->categoriesCollection = $loader->load();

        return $this->categoriesCollection;
	}


	public function categoriesToArray()
	{
		$categories = $this->categoriesCollection();

		if (!$categories) {
			return false;
		}

		$output = [];
		foreach ($categories as $s) {
			$output[] = $s->name()->val();
		}
		return $output;
	}

	/**
	 * @see project-details.mustache
	 * @return Array of tags label
	 */
	public function categoriesToString()
	{
		$output = $this->categoriesToArray();
		return implode(', ', $output);
	}

	/**
	 *
	 */
	public function challengesList()
	{
		if ($this->challengesList) {
			return $this->challengesList;
		}
		$challenges = $this->challenges();
		$lang = $this->currentLang();

		if (!isset($challenges[$lang])) {
			return false;
		}

		$currentChallenges = preg_split('/[|]/', $challenges[$lang]);
		$i = 0;
		$total = count($currentChallenges);
		if (!$total) {
			return false;
		}
		$ret = [];
		for (; $i<$total; $i++)
		{
			$index = ($i+1);
			if ($index < 10) {
				$index = '0'.$index;
			}
			$ret[] = [
				'index' => $index,
				'challenge' => $currentChallenges[$i]
			];
		}
		$this->challengesList = $ret;

		return $ret;
	}

	public function hasChallenge()
	{
		return !!(count($this->challengesList()));
	}

	public function hasAwards()
	{
		$awards = (string)$this->awards();
		if (!$awards) {
			return false;
		}
		return true;
	}

	/**
	 * URL
	 * Should be defined in some other way
	 * That i don't know yet.
	 * @return [type] [description]
	 */
	public function url()
	{
		// TranslationAwareTrait
		$lang = $this->currentLang();
		$slug = $this->helper()->urlize($this->name());

		$projectTranslation = [
			'en' => 'projects',
			'fr' => 'projets'
		];
		$project = $this->translatable($projectTranslation)->val();

		return $lang.'/'.$project.'/'.$this->id().'/'.$slug;
	}


/**
 * REGULAR SETTERS
 */
	public function setName($name)
	{
		$this->name = $this->translatable($name);
		return $this;
	}
	public function setTitle($title)
	{
		$this->title = $this->translatable($title);
		return $this;
	}
	public function setDescription($description)
	{
		$this->description = $this->translatable($description);
		return $this;
	}
	public function setAwards($awards)
	{
		$this->awards = $this->translatable($awards);
		return $this;
	}
	public function setChallenges($challenges)
	{
		$this->challenges = $challenges;
		return $this;
	}
	public function setClient($client)
	{
		$this->client = $client;
		return $this;
	}
	public function setCategories($cat)
	{
		$this->categories = $cat;
		return $this;
	}
	public function setLocation($loc)
	{
		$this->location = $this->translatable($loc);
		return $this;
	}
	public function setArea($area)
	{
		$this->area = $area;
		return $this;
	}
	public function setYear($year)
	{
		$this->year = $year;
		return $this;
	}
	public function setServices($services)
	{
		$this->services = $services;
		return $this;
	}
	public function setTags($tags)
	{
		$this->tags = $tags;
		return $this;
	}
	public function setImage($img)
	{
        $img = preg_replace('~www/~', '', $img, 1);
		$this->image = $img;
		return $this;
	}
	public function setHeaderImage($img)
	{
        $img = preg_replace('~www/~', '', $img, 1);
		$this->headerImage = $img;
		return $this;
	}

	public function setThumbnail($img)
	{
        $img = preg_replace('~www/~', '', $img, 1);
		$this->thumbnail = $img;
		return $this;
	}

/**
 * REGULAR GETTERS
 */
	public function name() { return $this->name; }
	public function title() { return $this->title; }
	public function description() { return $this->description; }
	public function challenges() { return $this->challenges; }
	public function awards() { return $this->awards; }
	public function client() { return $this->client; }
	public function categories() { return $this->categories; }
	public function location() { return $this->location; }
	public function area() { return $this->area; }
	public function year() { return $this->year; }
	public function services() { return $this->services; }
	public function tags() { return $this->tags; }
	public function image() { return $this->image; }
	public function thumbnail() { return $this->thumbnail; }
	public function headerImage() { return $this->headerImage; }

}
