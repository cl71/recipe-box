import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import { Button } from 'react-bootstrap';
import { Panel } from 'react-bootstrap';
import { Well } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import _ from 'lodash';

const getId = () => _.random(1,100000).toString();

class EditRecipe extends React.Component {
  constructor(props){
    super(props);
    this.state = {showModal: false, recipeName: this.props.recipe.name, ingredients: this.props.recipe.ingredients.join(',')};

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.updateRecipeName = this.updateRecipeName.bind(this);
    this.updateIngredients = this.updateIngredients.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true});
  }

  updateRecipeName(e) {
    this.setState({recipeName: e.target.value});
  }

  updateIngredients(e) {
    this.setState({ingredients: e.target.value});
  }

  render() {
    return (
      <div>
        <Button
          bsStyle="warning"
          onClick={this.open}> Edit recipe </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Edit a recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <FormGroup>
                <ControlLabel>Recipe</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Recipe Name"
                  onChange={this.updateRecipeName}
                  value={this.state.recipeName} />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Ingredients</ControlLabel>
                <FormControl
                  componentClass="textarea"
                  placeholder="Enter ingredients separated,by,commas"
                  onChange={this.updateIngredients}
                  value={this.state.ingredients} />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
                <Button
                  bsStyle="primary"
                  onClick={() => {this.props.save(this.props.id, this.state.recipeName, this.state.ingredients); this.close();}} > Save
                </Button>
                <Button
                  onClick={this.close} > Close
                </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({ open: !this.state.open });
  }
  render() {
    let ingredients = this.props.recipe.ingredients.map(function(ingredient, index) {
      return (
        <ListGroupItem key={index}>{ingredient}</ListGroupItem>
      )
    });
    return (
      <div>
      <Button bsStyle="info" onClick={this.toggle}>
        {this.props.recipe.name}
      </Button>
        <Panel
          collapsible
          expanded={this.state.open}
          >
            <h3 className="text-center">Ingredients</h3>
            <hr/>
            <ListGroup>
              {ingredients}
            </ListGroup>
            <EditRecipe
              recipe={this.props.recipe}
              id={this.props.id}
              save={this.props.edit}
            />
            <Button
              bsStyle="danger"
              onClick={() => { this.toggle(); this.props.remove(this.props.id);}}> Delete </Button>
        </Panel>
      </div>
    )
  }
}

class RecipeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {recipes: []};

    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
    this.edit = this.edit.bind(this);
  }
  componentWillMount() {
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    this.setState({recipes: recipes});
  }
  save(name, ingredients) {
    if(name && ingredients) {
      let newRecipe = {id: getId(), name:name, ingredients:ingredients.split(',')};
      let newRecipes = this.state.recipes.concat([newRecipe]);

      this.setState({recipes: newRecipes});
      localStorage.setItem('recipes', JSON.stringify(newRecipes));
    }
  }
  remove(id) {
    let newRecipes = this.state.recipes.filter((_) => _.id !== id);

    this.setState({recipes: newRecipes});
    localStorage.setItem('recipes', JSON.stringify(newRecipes));
  }
  edit(id, name, ingredients) {
    if(id && name && ingredients) {
      let newRecipes = this.state.recipes;
      let index = _.findIndex(newRecipes, (recipe) => recipe.id === id)
      newRecipes[index] = {id: id, name: name, ingredients: ingredients.split(',')};

      this.setState({recipes: newRecipes});
      localStorage.setItem('recipes', JSON.stringify(newRecipes));
    }
  }
  render() {
    let recipes = this.state.recipes.map( (recipe, index) => {
        return (
          <Recipe
            key={recipe.id}
            id={recipe.id}
            recipe={recipe}
            remove={this.remove}
            edit={this.edit} />
        )
    });
    return (
      <Well>
        {recipes}
        <AddRecipe
          save={this.save} />
      </Well>
    )
  }
}

class AddRecipe extends React.Component {
  constructor(props){
    super(props);
    this.state = {showModal: false, recipeName: '', ingredients: ''};

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.updateRecipeName = this.updateRecipeName.bind(this);
    this.updateIngredients = this.updateIngredients.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true, recipeName: '', ingredients: ''});
  }

  updateRecipeName(e) {
    this.setState({recipeName: e.target.value});
  }

  updateIngredients(e) {
    this.setState({ingredients: e.target.value});
  }

  render() {
    return (
      <div>
        <Button
          bsStyle="primary"
          onClick={this.open}> Add recipe </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add a recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <FormGroup>
                <ControlLabel>Recipe</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Recipe Name"
                  onChange={this.updateRecipeName}
                  value={this.state.recipeName} />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Ingredients</ControlLabel>
                <FormControl
                  componentClass="textarea"
                  placeholder="Enter ingredients separated,by,commas"
                  onChange={this.updateIngredients}
                  value={this.state.ingredients} />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="primary"
              onClick={() => {this.props.save(this.state.recipeName, this.state.ingredients); this.close();}} > Save
            </Button>
            <Button
              onClick={this.close} > Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <RecipeBox />
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
