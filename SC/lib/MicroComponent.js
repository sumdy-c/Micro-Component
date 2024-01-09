// TODO: БОЛЬШАЯ РАБОТА ПО ПЕРЕКВАЛИФИКАЦИИ ВСЕ ПОД UUID_4 / -- сразу, потом баг
// БАГ С ЗАВИСИМОСТЬЮ ПРОПАДЁТ ПРИ НАЛИЧИИ ЭЛЕМЕНТА КОТОРЫЙ УЖЕ СУЩЕСТВУЕТ И ПРИВЯЗАН К СТЕЙТУ , ЭТО НЕ РАБОТАЕТ ПРИ МНОЖЕСТВЕННЫХ ЗАВИСИМОСТЯХ
// Реквизиты ебанные множат свой виртуальный DOM, может переписать всё ? Пофиксил, но переписать.
/**
 * Хранилище компонентов
 */
const MicroStateComponents = new Set();

/**
 * Хранилище состояний
 */
const MicroStateStates = new Set();

/**
 * Вспомогательная сущность получения объектов
 */
class MCGet {
	/**
	 * Получить экземпляр MC по имени css файла
	 * @param { string } fileName 
	 * @returns 
	 */
	static GetMicroStateComponents =  function(fileName) {
		if(MicroStateComponents.length === 0) {
			console.warn('[Micro Component] Вы пытаетесь получить объект компонента, до их инциацлизации. Проверьте правильность вызова')
		}

		let localeStylize;
		
		MicroStateComponents.forEach((sc) => {
			if (sc.CSSfiles.includes(fileName)) {
				localeStylize = sc.stylize.bind(sc);
			}
		});
		return localeStylize;
	}

	static GetState = function(key){
		if(MicroStateComponents.length === 0) {
			console.warn('[Micro Component] Вы пытаетесь получить объект компонента, до их инциацлизации. Проверьте правильность вызова')
		}

		let state;

		MicroStateStates.forEach((st) => {
			if(st.key === key) {
				state = st;
			}
		});

		return state;
	}
}

/**
 * Класс для формирования экземпляра состояния MC и добавления примесей
 */
class State {
	/**
	 * Экземпляр состояния
	 */
	instance;
	/**
	 * Значение состояния, не влияющее на прокси, для безопасного получения
	 */
	save_value;
	/**
	 * Определение, является ли интерфейс новой инструкцией MC
	 */
	version = '2.0.0';
	/**
	 * Флаг State который применит функции SCmove при наличии вводного значения
	 */
	action = false;
	/**
	 * Ключ для получения объекта состояния
	 */
	key

	/**
	 * Cозданиe состояния для использования активностей MC
	 * @param { any } value значение по умолчанию
	 * @returns
	 */
	constructor(value, key) {
		this.key = null;
		if(value !== undefined) {
			this.action = true;
		}

		if(key !== undefined) {
			this.key = key;
		}

		this.save_value = value;
		this.instance = { value: value };
		MicroStateStates.add(this);
		return this;
	}

	/**
	 * Сеттер изменения состояния MC
	 * @param { any } new_value новое значение состояния
	 */
	set(new_value) {
		this.set_save(new_value);
		try {
			this.instance.value.value = new_value;	
		} catch (error) {
			console.error('[Micro Component] Вероятно вы инициализировали состояние, но не создали его функцией привязки к компоненту. Пожалуйста удостоверьтесь, что контролёр был создан.')
		}
	}

	reg() {
		return this.instance.value.value;
	}

	/**
	 * Это сервисная фунция, используйте set()
	 */
	set_save(val) {
		this.save_value = val;
	}
	
	/**
	 * Cервисная фунция для запуска инициализации изменений состояний
	 */
	go() {
		this.instance.value.value = this.save_value;
	}

	/**
	 * Геттер получения состояния MC
	 */
	get() {
		return this.save_value;
	}
}

/**
 * Сущность определяющая функциональность активностей MC стилей.
 */
class SCmove {
	/**
	 * Состояние вхождения
	 */
	state;
	/**
	 * Список сохранённых состояний
	 */
	states;
	/**
	 * Ссылка на основной компонент Micro Component
	 */
	SCmain;
	/**
	 * Проксируемое значение отсылающие к прокси
	 */
	valueState;
	/**
	 * Объект прокси
	 */
	proxyState;
	/**
	 * Итератор для создания уникальных ключей
	 */
	safeIterator;
	/**
	 * Пользовательская MC функция
	 */
	personfn;
	/**
	 * Изменяемый стиль переданный аргументом
	 */
	saveMoveClass;
	/**
	 * Переданный аргументом селектор
	 */
	saveMoveSel;
	/**
	 * @deprecated
	 * Модификация SCmove для манипуляции над элементами с помощью проксирования
	 */
	toggleMod;
	/**
	 * Функция поддержки виртуализации
	 */
	virtualFn;
	/**
	 * Не выведеные состояния для построения ветвей рендеринга
	 */
	treeVirtualState;

	/**
	 * Инициализация SCmove
	 */
	constructor(SCmain) {
		this.SCmain = SCmain;
		this.treeVirtualState = [];
		this.states = new Set();
	}

	/**
	 * Генерируемый уникальный идентификтор
	 */
	uuidv4() {
		return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
			(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
		);
	}

	/**
	 * Предоставляет прокси, для мутирования
	 * @param {service} o Оригинальный объект
	 * @param {service} fn Функция немедленого вызова
	 * @param {service} path Неопределенный путь
	 * @returns Объект проксирования на оригинальный объект
	 */
	stateProxy(o, fn, path) {
		let tree = {};
		if (!path) {
			path = 'obj';
		}
		const proxySC = new Proxy(o, {
			get: (_, prop) => {
				if (typeof o[prop] != 'object') {
					return o[prop];
				}
				if (tree[prop] === undefined) {
					tree[prop] = this.stateProxy(o[prop], fn, `${path}.${prop}`);
				}
				return Reflect.get(...arguments);
			},
			set: (_, prop, val) => fn(val, prop, proxySC, o[prop]) || 1,
		});
		return proxySC;
	}
	/**
	 * Предоставляет прокси, для мутирования DOM
	 * @param {service} o Оригинальный объект
	 * @param {service} fn Функция немедленого вызова
	 * @param {service} path Неопределенный путь
	 * @returns Объект проксирования на оригинальный объект
	 */
	handlerDOM(o, fn, path) {
		let tree = {};
		if (!path) {
			path = 'obj';
		}
		const proxyDOM = new Proxy(o, {
			get: (_, prop) => {
				if (typeof o[prop] != 'object') {
					return o[prop];
				}
				if (tree[prop] === undefined) {
					tree[prop] = this.handlerDOM(o[prop], fn, `${path}.${prop}`);
				}
				return Reflect.get(...arguments);
			},
			set: (_, prop, val) => {
				fn(val, prop, proxyDOM)
				val.fn();
				
				return val;
			},
		});
		return proxyDOM;
	}

	render = async (state, prop, HTMLElement) => {
		state.virtual.replaceWith(state.userNode);
	};
	
	requisite = (state, renderFn, target, parentFn) => {
		const renderChild = {
			key: 'child',
			parent: target,
			parentFn: parentFn
		};

		let skip = false;

		this.treeVirtualState.forEach(virtual => {
			if(virtual.proxyState === target.proxyState) {
				skip = true;
			}
		});
		
		if(!skip) {
			this.treeVirtualState.push(target);
		}

		return this.SCmain.stylize(state, renderFn, renderChild);
	}

	/**
	 * Функция немедленного вызова при изменений проксируемого объекта
	 * @param {service} val приходящее новое значение
	 */
	action = (val, arg, arg1, arg2) => {
		console.log('action');
		this.states.forEach((item) => {
			if (arg1 === item.proxyState.value) {
				if(item.tree) {
						this.NotTread = true;
						item.state = val;
						item.CollectionDOM.forEach(html => {
							if(html.parent) {
								let newNode;
								if(html.parent.child) {
									this.states.forEach(item => {
										if(item.key === html.parent.state.key) {
											newNode = html.parent.Function(item.state, (state, renderFn) => {
												return this.requisite(state, renderFn, item, html.parent.Function);
											});
											html.lastState = newNode[0];
										}
									})
								} else {
									this.states.forEach(item => {
										if(item.key === html.parentState.key) {
											newNode = html.parent.Function(html.parentState.state, (state, renderFn) => {
												return this.requisite(state, renderFn, item, html.parent.Function);
											});
										}
									});
								}
								
								if(!newNode) {
									newNode = [];
									const virtualElement = document.createElement('micro_component');
									virtualElement.setAttribute("style", "height: 0; width: 0; display: none;");
									newNode.push(virtualElement);
								}

								html.parent.virtualDOM.DOM = { virtual: html.parent.lastState, userNode: newNode[0], fn: () => {
									html.parent.lastState = newNode[0];
								}};

								return;
							}

							let newNode;
							if(html.child) {
								this.states.forEach(item => {
									if(item.key === html.state.key) {
										newNode = html.Function(item.state, (state, renderFn) => {
											return this.requisite(state, renderFn, item, html.Function);
										});
									}
								})
							} else {
								newNode = html.Function(val, (state, renderFn) => {
									return this.requisite(state, renderFn, item, html.Function);
								});
							}
							
							if(!newNode) {
								newNode = [];
								const virtualElement = document.createElement('micro_component');
								virtualElement.setAttribute("style", "height: 0; width: 0; display: none;");
								newNode.push(virtualElement);
							};
							
							html.virtualDOM.DOM = { virtual: html.lastState, userNode: newNode[0], fn: () => {
								html.lastState = newNode[0];
							}};
						});

					return;
				}

				item.selectors.forEach((sel) => {
					if (item.state.value !== val || sel.noCheck || sel.fastStart) {
						sel.fastStart = false;
						if (item.toggle) {
							if (Array.isArray(val)) {
								val.forEach((instruction) => {
									this.personfn(sel.target, instruction);
								});
							} else if (val === '*empty') {
								$(sel.target).empty();
							} else if (val === '*remove') {
								$(sel.target).remove();
							} else {
								return this.personfn(sel.target, val);
							}
						} else {
							this.personfn(sel.target, sel.SCstyle(val));
						}
					}
				});

				if (typeof val === 'object') {
					val = JSON.stringify(val);
				}
				item.state.value = val;
				item.fastStart = false;
			}
		});
	};

	/**
	 * Создания контролируемого списка для реализации хранилища состояний
	 * @param { any } arg значение инициализации
	 * @returns { void } список состояний
	 */
	controlState(arg, mod, noCheck, SCS, lastState, paramRender) {
		let key = this.uuidv4();
		if(arg === 'tree') {
			let element = null;
			const fn = SCS;
			let checkState = false;
			this.states.forEach((item) => {
				if (item.proxyState === mod) {
					const VIRTUAL_CONNECTOR = {
						Function: fn,
						id: this.uuidv4(),
						lastState: lastState,
						virtualDOM: this.handlerDOM(lastState, this.render, item.proxyState)
					};

					if(paramRender && paramRender.variant === "child") {
						VIRTUAL_CONNECTOR.child = true;
						VIRTUAL_CONNECTOR.state = item;
						VIRTUAL_CONNECTOR.parentFn = paramRender.parentFn;

						this.treeVirtualState.forEach(item => {
							item.CollectionDOM.push(VIRTUAL_CONNECTOR);
						});
					};

					const COLLECTION_CONTAINER = [];

					if(paramRender && paramRender.variant === "dep") {
						const fnTree = [];
						fnTree.push(fn);
						this.states.forEach(item => {
							if (item.proxyState === paramRender.parent) {
								item.CollectionDOM.forEach((virtual => {
									let VIRTUAL_CONNECTOR = {};
									if(fnTree.includes(virtual.Function)) {
										VIRTUAL_CONNECTOR.Function = virtual.Function;
										VIRTUAL_CONNECTOR.lastState = virtual.lastState;
										VIRTUAL_CONNECTOR.id = virtual.id;
										VIRTUAL_CONNECTOR.parent = virtual;
										VIRTUAL_CONNECTOR.parentState = item;
										VIRTUAL_CONNECTOR.parentValue = paramRender.value_parent;
										VIRTUAL_CONNECTOR.virtualDOM = virtual.virtualDOM;
										COLLECTION_CONTAINER.push(VIRTUAL_CONNECTOR);
										return;
									}

									if(fnTree.includes(virtual.parentFn)) {
										fnTree.push(virtual.Function);
										VIRTUAL_CONNECTOR.Function = virtual.Function;
										VIRTUAL_CONNECTOR.lastState = virtual.lastState;
										VIRTUAL_CONNECTOR.id = virtual.id;
										VIRTUAL_CONNECTOR.parent = virtual;
										VIRTUAL_CONNECTOR.parentState = item;
										VIRTUAL_CONNECTOR.parentValue = paramRender.value_parent;
										VIRTUAL_CONNECTOR.virtualDOM = virtual.virtualDOM;
										COLLECTION_CONTAINER.push(VIRTUAL_CONNECTOR);
										return;
									}
								}))
							}
						});
					};

					if(COLLECTION_CONTAINER.length) {
						item.CollectionDOM.push(...COLLECTION_CONTAINER);
					} else {
						item.CollectionDOM.push(VIRTUAL_CONNECTOR);
					}

					if(item.state && !COLLECTION_CONTAINER.length) {
						let newNode = VIRTUAL_CONNECTOR.Function(item.state, (state, renderFn) => { 
							return this.requisite(state, renderFn, item, VIRTUAL_CONNECTOR.Function);
						});

						if(!newNode) {
							newNode = [];
							const virtualElement = document.createElement('micro_component');
							virtualElement.setAttribute("style", "height: 0; width: 0; display: none;");
							newNode.push(virtualElement);	
						}

						VIRTUAL_CONNECTOR.virtualDOM.DOM = { virtual: VIRTUAL_CONNECTOR.lastState, userNode: newNode[0], fn: () => {
							VIRTUAL_CONNECTOR.lastState = newNode[0];
						}};
		
						element = newNode[0];
					} else {
						element = null;
					}

					checkState = true;
				};
			});

			if (checkState) {
				return element;
			};

			const VIRTUAL_CONNECTOR = {
				Function: fn,
				lastState: lastState,
				id: this.uuidv4(),
				virtualDOM: this.handlerDOM(lastState, this.render, mod)
			};

			const COLLECTION_CONTAINER = [];
			
			let parentTreeDependence = null;

			if(paramRender && paramRender.variant === "child") {
				parentTreeDependence = paramRender.parent;
				VIRTUAL_CONNECTOR.child = true;
				VIRTUAL_CONNECTOR.state = null;
				VIRTUAL_CONNECTOR.parentFn = paramRender.parentFn;

				this.treeVirtualState.forEach(item => {
					item.CollectionDOM.push(VIRTUAL_CONNECTOR);
				});
			};

			if(paramRender && paramRender.variant === "dep") {
				const fnTree = [];
				fnTree.push(fn);
				this.states.forEach(item => {
					if (item.proxyState === paramRender.parent) {
						item.CollectionDOM.forEach((virtual => {
							let VIRTUAL_CONNECTOR = {};
							if(fnTree.includes(virtual.Function)) {
								VIRTUAL_CONNECTOR.Function = virtual.Function;
								VIRTUAL_CONNECTOR.lastState = virtual.lastState;
								VIRTUAL_CONNECTOR.id = virtual.id;
								VIRTUAL_CONNECTOR.parent = virtual;
								VIRTUAL_CONNECTOR.parentState = item;
								VIRTUAL_CONNECTOR.parentValue = paramRender.value_parent;
								VIRTUAL_CONNECTOR.virtualDOM = virtual.virtualDOM;
								COLLECTION_CONTAINER.push(VIRTUAL_CONNECTOR);
								return;
							}

							if(fnTree.includes(virtual.parentFn)) {
								fnTree.push(virtual.Function);
								VIRTUAL_CONNECTOR.Function = virtual.Function;
								VIRTUAL_CONNECTOR.lastState = virtual.lastState;
								VIRTUAL_CONNECTOR.id = virtual.id;
								VIRTUAL_CONNECTOR.parent = virtual;
								VIRTUAL_CONNECTOR.parentState = item;
								VIRTUAL_CONNECTOR.parentValue = paramRender.value_parent;
								VIRTUAL_CONNECTOR.virtualDOM = virtual.virtualDOM;
								COLLECTION_CONTAINER.push(VIRTUAL_CONNECTOR);
								return;
							}
						}))
					}
				});
			};

			const itemState = {
				parent: parentTreeDependence, 
				state: mod.value,
				key: key,
				CollectionDOM: COLLECTION_CONTAINER.length > 0 ? COLLECTION_CONTAINER : [VIRTUAL_CONNECTOR],
				proxyState: mod,
				tree: true
			};

			if(paramRender && paramRender.variant === "child") {
				VIRTUAL_CONNECTOR.state = itemState;
			};

			if(mod.value) {
				let newNode;
				if(VIRTUAL_CONNECTOR.parent) {
					this.states.add(itemState);
					return;
				} else {
					if(COLLECTION_CONTAINER.length) {
						this.states.add(itemState);
						return;
					}

					newNode = VIRTUAL_CONNECTOR.Function(mod.value, (state, renderFn) => {
						return this.requisite(state, renderFn, itemState, VIRTUAL_CONNECTOR.Function);
					});
				}
				
				if(!newNode) {
					newNode = [];
					const virtualElement = document.createElement('micro_component');
					virtualElement.setAttribute("style", "height: 0; width: 0; display: none;");
					newNode.push(virtualElement);	
				}

				VIRTUAL_CONNECTOR.virtualDOM.DOM = { virtual: VIRTUAL_CONNECTOR.lastState, userNode: newNode[0], fn: () => {
					VIRTUAL_CONNECTOR.lastState = newNode[0];
				}};

				this.states.add(itemState);
				return newNode[0];
			};

			this.states.add(itemState);
			return null;
		};

		if (this.states.size === 0) {
			this.states.add({
				state: this.state,
				key: key,
				selectors: [{ target: this.saveMoveSel, SCstyle: this.saveMoveClass, fastStart: SCS.action, noCheck: noCheck }],
				proxyState: this.proxyState,
				toggle: mod,
			});
			return;
		};

		let checkState = false;

		this.states.forEach((item) => {
			if (item.proxyState === arg) {
				checkState = true;
				item.selectors.push({ target: this.saveMoveSel, SCstyle: this.saveMoveClass, fastStart: SCS.action, noCheck: noCheck });
			}
		});

		if (!checkState) {
			this.states.add({
				state: this.state,
				key: key,
				selectors: [{ target: this.saveMoveSel, SCstyle: this.saveMoveClass, fastStart: SCS.action, noCheck: noCheck }],
				proxyState: this.proxyState,
				toggle: mod,
			});
			return;
		}
	};

	/**
	 * Создание состояния.
	 * @param { any } arg приходящее значение
	 */
	create(arg, mod, noCheck, SCS) {
		this.valueState = this.stateProxy(this.state, this.action, this.valueState);
		this.controlState(arg, mod, noCheck, SCS);
		arg.value = this.valueState;
	}

	createStateTree(instance, SCS, fn, arg, wrap, paramRender) {
		const valueState = this.stateProxy({ value: instance.value }, this.action, { value: null });
		const state = this.controlState('tree', instance, SCS, fn, wrap, paramRender);
		instance.value = valueState;
		return state;
	}

	/**
	 * Функция первого вхождения для инициализации создания состояний
	 * @param {*} arg Значение инициализации
	 * @param {*} selector Контролируемый селектор
	 * @param {*} SCclass Применяемый стиль
	 * @param {*} SCmain Объект основной MC библиотеки
	 */
	move(arg, selector, SCclass, SCmain, noCheck, SCS) {
		this.safeIterator = this.uuidv4();
		this.state = {
			value: arg.value,
		};

		this.valueState = {
			value: null,
		};

		this.proxyState = arg;

		this.saveMoveSel = selector;

		!SCclass ? (this.saveMoveClass = undefined) : (this.saveMoveClass = SCclass);

		this.personfn = (sel, scclass) => {
			SCmain.stylize($(sel), scclass);
		};

		if(noCheck === undefined){
			noCheck = false;
		}

		this.create(arg, !SCclass, noCheck, SCS);
	}

	/**
	 * Функция создания дерева состояний
	 * @param {*} arg Значение инициализации
	 * @param {*} State Экземпляр работы с состоянием
	 * @param {*} fn Функция построения дерева
	 */
	statement(instance, SCmain, fn, arg, wrap, dependency) {
		this.safeIterator = this.uuidv4();
		if(dependency && dependency.key === 'child') {
			const node = this.createStateTree(instance, SCmain, fn, dependency.parent, wrap, { 
				variant: 'child',
				parent: dependency.parent,
				value_parent: dependency.state,
				parentFn: dependency.parentFn
			});
			return node;
		};

		const node = this.createStateTree(instance, SCmain, fn, arg, wrap);

		if(dependency && Array.isArray(dependency)) {
			dependency.forEach(item => {
				this.createStateTree(item.instance, SCmain, fn, item, wrap, { variant: 'dep', parent: instance, value_parent: arg.save_value });
			});
		}

		return node;
	}
}

/**
 * Классовый компонент для упрощения стилизации, организации безопасности и мутации стилей.
 */
class MicroComponent {
	/**
	 * Название и год разработки библиотеки, для разного
	 */
	commercialName = 'Micro Component | 2023';

	/**
	 * Схема стилизации MC
	 */
	stylesScheme;

	/**
	 * Отслеживаемые документы CSS
	 */
	CSSfiles;

	/**
	 * Найденные CSS классы
	 */
	CSSdocumentsClasses;

	/**
	 * Идентификатор созданого MC экземпляра
	 */
	SCid;

	/**
	 * Объект настройки MC
	 * offWarn - выключить предупреждения ( bool )
	 * deleteNativeCSS - удалить исходный CSS из документа ( bool )
	 * progressiveVar - ...
	 * mutateCSS - включает мутацию css
	 */
	settingSC;

	/**
	 * Ссылка на область контроля css в пространстве документа
	 */
	document_style;

	/**
	 *	Таблица стилей созданная MC
	 */
	SCStyleSheet;

	/**
	 * Определяет дерево зависимостей рендеренга
	 */
	childrenVirtual;

	/**
	 *  Настройка и инициализация MC
	 */
	constructor(param) {
		this.settingSC = { init: 'disable' };
		this.document_style = [];
		this.stylesScheme = {};
		this.CSSdocumentsClasses = [];
		if (param) {
			this.settingSC = param;
			this.settingSC.init = 'enable';
		}
	}

	/**
	 * Генерируемый уникальный идентификтор
	 */
	uuidv4() {
		return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
			(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
		);
	}

	/**
	 * Создаёт случайное значение для мутирования класса
	 * @returns { string } рандомное значение
	 */
	generateRandomValue() {
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var length = 6;
		var randomValue = '';

		for (var i = 0; i < length; i++) {
			var randomIndex = Math.floor(Math.random() * characters.length);
			randomValue += characters.charAt(randomIndex);
		}

		return randomValue;
	}

	/**
	 * Функция для проверки повторений css классов в доверенных MC файлах
	 * @param { array } arr массив стилей для проверки
	 * @param {*} resparr результирующий массив, хранящий в себе дублируемое значение классов
	 */
	hasDuplicatesClassCSS(arr, resparr) {
		return arr.some(function (currentObj, index) {
			return arr.some(function (obj, i) {
				if (i !== index && obj.selectorText === currentObj.selectorText) {
					resparr.push(currentObj.selectorText);
				}
			});
		});
	}

	/**
	 * Создаёт css класс и помещает его на страницу
	 * @param { string } className
	 * @param { string } styles
	 */
	createCssNode() {
		// новая реализация
		this.SCStyleSheet = new CSSStyleSheet();
		document.adoptedStyleSheets = [...document.adoptedStyleSheets, this.SCStyleSheet];
	}

	/**
	 * Инициализирует область видимости и стилизацию на странице
	 */
	initCSSClass() {
		const initStyleze = Array.from(document.styleSheets);
		const styleArr = [];
		this.CSSfiles.forEach((userCss) => {
			styleArr.push(
				initStyleze.find((item) => {
					if (item.href && item.href.match(/\/([^\/]+\.css)$/)) {
						return item.href.match(/\/([^\/]+\.css)$/)[1] === userCss;
					}
				})
			);
			this.document_style.push(
				initStyleze.findIndex((item) => {
					if (item.href && item.href.match(/\/([^\/]+\.css)$/)) {
						return item.href.match(/\/([^\/]+\.css)$/)[1] === userCss;
					}
				})
			);
		});

		styleArr.forEach((noValidStyle) => {
			if(!noValidStyle) {
				if (this.settingSC) {
					if (!this.settingSC.offWarn) {
						console.error(
							`[Micro Component] Ошибка подключения стилей`
						);
					}
				};
				return;
			}
			
			Array.from(noValidStyle.rules).forEach((noValidClasses, index) => {
				try {
					const noValCSSObj = {};
					noValCSSObj.selectorText = noValidClasses.selectorText;
					noValCSSObj.cssText = noValidClasses.style.cssText;
						this.CSSdocumentsClasses.push(noValCSSObj);
						if (this.settingSC) {
							if (this.settingSC.deleteNativeCSS) {
								noValidStyle.deleteRule(0);
							}
						}
				} catch (e) {}
			});
		});

		const valStyleArr = [];
		this.hasDuplicatesClassCSS(this.CSSdocumentsClasses, valStyleArr);
		if (valStyleArr.length > 1) {
			if (this.settingSC) {
				if (!this.settingSC.offWarn) {
					console.warn(
						`[Micro Component] Обнаружено дублирование CSS классов! Обратите внимание, что это может привести к неправильному поведению страницы`
					);
					console.warn(`[Micro Component] Дубли ${valStyleArr.join(', ')}`);
				}
			} else {
				console.warn(
					`[Micro Component] Обнаружено дублирование CSS классов! Обратите внимание, что это может привести к неправильному поведению страницы`
				);
				console.warn(`[Micro Component] Дубли ${valStyleArr.join(', ')}`);
			}
		}
	}

	/**
	 * Удаляет класс по переданому селектору и названию класса
	 * @param { object } sel
	 * @param { string } cssClass
	 */
	removeStyledComponentClasses(sel, cssClass) {
		const rmClass = cssClass.replace('-', '.');
		this.CSSdocumentsClasses.map((cls) => {
			if (cls.hasOwnProperty('originalClass')) {
				if (cls.originalClass === rmClass) {
					$(sel).removeClass(cls.selectorText.substring(1));
				}
			}
		});
	}

	proggresiveVar() {
		window.DIV='DIV';window.SPAN ='SPAN';window.BUTTON="BUTTON";window.ASIDE="ASIDE";window.FOOTER="FOOTER";window.HEADER="HEADER";window.H1="H1";window.H2="H2";window.H3="H3";window.H4="H4";window.H5="H5";window.H6="H6";window.MAIN="MAIN";window.NAV="NAV";window.LI="LI";window.MENU= "MENU";window.P="P";window.UL="UL";window.A="A";window.IMG="IMG";window.VIDEO="VIDEO";window.IFRAME="IFRAME";window.SVG="SVG";window.CANVAS="CANVAS";window.FORM="FORM";window.INPUT="INPUT";window.LABEL="LABEL";window.OPTION="OPTION";window.SELECT="SELECT";window.TEXTAREA="TEXTAREA";window.TEMPLATE="TEMPLATE";
	}

	/**
	 * Добавляет класс по переданному селектру и названию класса
	 * @param { object } sel Селектор, для добавления
	 * @param { string } cssClass Название класса
	 */
	styledComponentClasses(sel, cssClass) {
		let noCreate = false;
		function modifyClassNames(cssArray, oldClassName, newClassName) {
			cssArray.forEach(function (cssObj) {
				cssObj.originalClass = cssObj.selectorText;
				cssObj.selectorText = cssObj.selectorText.replace(oldClassName, newClassName);
			});
			return cssArray;
		}

		const CSSInit = [];
		this.CSSdocumentsClasses.map((cls) => {
			if (cls.hasOwnProperty('originalClass')) {

				if (cls.originalClass === cssClass) {
					$(sel).addClass(cls.selectorText.substring(1)).attr('SC', this.SCid);
					noCreate = true;
				}

			}

			if (cls.selectorText.includes(cssClass)) {
				CSSInit.push(cls);
			}
		});

		if (noCreate) {
			return;
		}

		if (CSSInit.length === 0) {
			if (this.settingSC) {
				if (!this.settingSC.offWarn) {
					console.warn(
						`[Micro Component] Не удалось найти CSS класс. Возможно вы не подключили файл в отслеживание MC или опечатались.`
					);
					console.warn(`[Micro Component] Проблема была обнаружена с - ${cssClass}`);
				}
			} else {
				console.warn(
					`[Micro Component] Не удалось найти CSS класс. Возможно вы не подключили файл в отслеживание MC или опечатались.`
				);
				console.warn(`[Micro Component] Проблема была обнаружена с - ${cssClass}`);
			}
			return;
		}

		const newCSSName = `.SC_${cssClass.substring(1)}-${this.generateRandomValue()}`;
		const modifiedCssArray = modifyClassNames(CSSInit, cssClass, newCSSName);

		modifiedCssArray.forEach((stylerCSS) => {
			this.SCStyleSheet.insertRule(`${stylerCSS.selectorText} {${stylerCSS.cssText}}`, 0);
		});

		$(sel).addClass(newCSSName.substring(1)).attr('SC', this.SCid);
	}


	createElementCheck(val) {
		const invalid_HTML = ['HTML','BASE','HEAD','LINK','META','STYLE','TITLE','BODY','SHADOW'];
		const valid_HTML = 'ADDRESS,ARTICLE,ASIDE,FOOTER,HEADER,H1,H2,H3,H4,H5,H6,HGROUP,MAIN,NAV,SECTION,SEARCH,BLOCKQUOTE,DD,DIV,DL,DT,FIGCAPTION,FIGURE,HR,LI,MENU,OL,P,PRE,UL,A,ABBR,B,BDI,BDO,BR,CITE,CODE,DATA,DFN,EM,I,KBD,MARK,Q,RP,RT,RUBY,S,SAMP,SMALL,SPAN,STRONG,SUB,SUP,TIME,U,VAR,WBR,AREA,AUDIO,IMG,MAP,TRACK,VIDEO,EMBED,IFRAME,OBJECT,PICTURE,PORTAL,SOURCE,SVG,MATH,CANVAS,NOSCRIPT,SCRIPT,DEL,INS,CAPTION,COL,COLGROUP,TABLE,TBODY,TD,TFOOT,TH,THEAD,TRBUTTON,DATALIST,FIELDSET,FORM,INPUT,LABEL,LEGEND,METER,OPTGROUP,OPTION,OUTPUT,PROGRESS,SELECT,TEXTAREA,DETAILS,DIALOG,SUMMARY,SLOT,TEMPLATE,ACRONYM,BIG,CENTER,CONTENT,DIR,FONT,FRAME,FRAMESET,IMAGE,MARQUEE,MENUITEM,NOBR,NOEMBED,NOFRAMES,PARAM,PLAINTEXT,RB,RTC,STRIKE,TT,XMP';
		if(invalid_HTML.includes(val)){
			console.error(`MC | Использовать метаданные документа и корень раздела не позволяется. Проблема возникла с ${val}, может в хотели найти этот элемент ? Напишите его без использования КАПСа`);
			return false;
		}

		if(valid_HTML.includes(val)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Проверка валидности создания элементов синтаксисом большой буквы
	 */
	hasCapital = (s) => !/^[a-zа-я\d]*$/.test(s);

	/**
	 * Функция для обработки селекторов заданной стилизацией
	 * @param { JQselector } selector селектор, к которому нужно привязать стили
	 * @param { string } stylesClass имя по которому должны вернуть стили
	 * @returns Стилизованный селектор
	 */
	stylize = (selector, stylesClass, dependency) => {
		console.log('stylize');
		if(selector.__proto__.constructor.name === 'State' && typeof stylesClass === 'function') {

			let current = null;
			let element;

			MicroStateComponents.forEach((sc) => {
				if (this.SCid === sc.SCid) {
					current = sc;
				}
			});

			current.SCmove.states.forEach(item => {
				if(item.CollectionDOM) {
					item.CollectionDOM.forEach(virtual => {
						if(virtual.Function === stylesClass.Function) {
							element = virtual.lastState;
						}
					});
				}
				
			});
			
			if(element) {
				return element;
			};

			this.childrenVirtual = true;

			const wrap = document.createElement('micro_component');
			wrap.setAttribute("style", "height: 0; width: 0; display: none;");

			const node = current.SCmove.statement(selector.instance, current, stylesClass, selector, wrap, dependency);
			
			this.childrenVirtual = false;

			if(node) {
				return node;
			};

			return wrap;
		};

		if(this.settingSC && !this.settingSC.mutateCSS) {
			if (!stylesClass) {
				let styledSelector;
				if(this.createElementCheck(selector)) {
					if (this.hasCapital(selector) && selector[0] !== '.') {
						styledSelector = $(`<${selector.toLowerCase()}>`).attr('SC', this.SCid);
					}
					return styledSelector;
				} else {
					return styledSelector = $(selector).attr('SC', this.SCid);
				}
			};
 
			let styledSelector;

			if (this.hasCapital(selector) && selector[0] !== '.' && this.createElementCheck(selector)) {
				styledSelector = $(`<${selector.toLowerCase()}>`);
			} else {
				styledSelector = $(selector);
			}


			if (stylesClass[0] === '.') {
				$(styledSelector).addClass(stylesClass.substring(1));
				return styledSelector;
			} else if (stylesClass[0] === '-') {
				$(styledSelector).removeClass(stylesClass);
				return styledSelector;
			} else if (stylesClass === '!line') {
				styledSelector.removeAttr('style');
				return styledSelector;
			} else if (stylesClass === '!class') {
				styledSelector.removeClass();
				return styledSelector;
			} else if (stylesClass === '*remove') {
				styledSelector.remove();
				return null;
			} else if (stylesClass === '*empty') {
				styledSelector.empty();
				return styledSelector;
			} else if (Array.isArray(stylesClass)) {
				stylesClass.forEach((instruction) => {
					this.stylize(styledSelector, instruction);
				});
				return styledSelector;
			} else {
				return styledSelector;
			}
		}

		if (!stylesClass) {
			let styledSelector 
			if(this.createElementCheck(selector)) {
				if (this.hasCapital(selector) && selector[0] !== '.') {
					styledSelector = $(`<${selector.toLowerCase()}>`).attr('SC', this.SCid);
				}
				return styledSelector;
			} else {
				styledSelector = $(selector).attr('SC', this.SCid);
			}

			if (styledSelector.length === 0) {
				this.CSSdocumentsClasses.map((cls) => {
					if (cls.hasOwnProperty('originalClass')) {
						if (cls.originalClass === selector) {
							styledSelector = $(cls.selectorText);
							return styledSelector;
						}
					}
				});
			}

			return styledSelector;
		};

		let styledSelector;

			if (this.hasCapital(selector) && selector[0] !== '.' && this.createElementCheck(selector)) {
				styledSelector = $(`<${selector.toLowerCase()}>`);
			} else {
				styledSelector = $(selector);
			}

			if (styledSelector.length === 0) {
				this.CSSdocumentsClasses.map((cls) => {
					if (cls.hasOwnProperty('originalClass')) {
						if (cls.originalClass === selector) {
							styledSelector = $(cls.selectorText);
						}
					}
				});
			}

		if (stylesClass[0] === '.') {
			this.styledComponentClasses(styledSelector, stylesClass);
			return styledSelector;
		} else if (stylesClass[0] === '-') {
			this.removeStyledComponentClasses(styledSelector, stylesClass);
			return styledSelector;
		} else if (stylesClass === '!line') {
			styledSelector.removeAttr('style');
			return styledSelector;
		} else if (stylesClass === '!class') {
			styledSelector.removeClass();
			return styledSelector;
		} else if (stylesClass === '*remove') {
			styledSelector.remove();
			return null;
		} else if (stylesClass === '*empty') {
			styledSelector.empty();
			return styledSelector;
		} else if (Array.isArray(stylesClass)) {
			stylesClass.forEach((instruction) => {
				this.stylize(styledSelector, instruction);
			});
			return styledSelector;
		} else {
			return styledSelector;
		}
	};

	use(classesStyleSheet) {
		if(this.settingSC && this.settingSC.mutateCSS) {
			this.CSSfiles = classesStyleSheet;
			this.initCSSClass();
			this.createCssNode();
		}

		this.SCid = (Date.now() / 28).toFixed(0) + this.generateRandomValue();
		this.SCmove = new SCmove(this);
		MicroStateComponents.add(this);
		this.goSC();

		if (this.settingSC) {
			if (this.settingSC.progressiveVar) {
				this.proggresiveVar()
			}
		}

		return this.stylize.bind(this);
	}

	/**
	 * Использовать функционал активностей MC
	 * @param { MC } sc instance MC
	 */
	goSC = () => {
		/**
		 * Создание глобальных функций, только раз на страницу
		 */
		if (MicroStateComponents.size > 1) {
			return;
		}

		/**
		 * Если не передавать второй аргумент, значение состояние будет использовано как инструкция для стилизации
		 * @param { object } arg переменная для проксирования на неё состояния
		 * @param { * } SCclass Изменяемый стиль
		 * @returns селектор
		 */
		$.fn.MCstate = function (arg, SCclass, noCheck) {
			if (!$(this).attr('sc')) {
				console.error(
					`[Micro Component] Вы пытаетесь назначить обработчик MC, на компонент который не был им зарегистрирован! Проверьте селектор к которому вы пытаетесь применить функции MC!`
				);
				console.error(arg);
				console.error(this);
				return;
			}

			let self;
			MicroStateComponents.forEach((sc) => {
				if ($(this).attr('sc') === sc.SCid) {
					self = sc;
				}
			});

			if (arg.version === '2.0.0') {
				self.SCmove.move(arg.instance, $(this), SCclass, self, noCheck, arg);
				if(arg.action) {
					arg.go();
				}
				return this;
			};

			return this;
		};

		$.fn.MCadd = function (SCclass) {
			if (!$(this).attr('sc')) {
				console.error(
					`[Micro Component] Вы пытаетесь назначить обработчик MC, на компонент который не был им зарегистрирован! Проверьте селектор к которому вы пытаетесь применить функции MC!`
				);
				console.error(arg);
				console.error(this);
				return;
			}
			let self;
			MicroStateComponents.forEach((sc) => {
				if ($(this).attr('sc') === sc.SCid) {
					self = sc;
				}
			});
			self.stylize(this, SCclass);
			return this;
		};

		$.fn.MChasClass = function (SCclass) {
			if (!$(this).attr('sc')) {
				console.error(
					'[Micro Component] Вы пытаетесь проверить обработчик MC, на компонент который не был им зарегистрирован! Проверьте селектор к которому вы пытаетесь применить функции MC!'
				);
				return;
			}

			let self;
			let resultCheck = false;
			MicroStateComponents.forEach((sc) => {
				if ($(this).attr('sc') === sc.SCid) {
					self = sc;
				}
			});

			self.CSSdocumentsClasses.map((cls) => {
				if (cls.hasOwnProperty('originalClass')) {
					if (cls.originalClass === SCclass) {
						if ($(this).hasClass(cls.selectorText.substring(1))) {
							resultCheck = true;
						}
					}
				}
			});
			return resultCheck;
		};
	};
}