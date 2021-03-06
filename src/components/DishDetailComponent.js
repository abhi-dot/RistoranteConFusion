import React, {Component} from 'react';
import { Card , CardImg  , CardTitle , CardText , CardBody , BreadcrumbItem, Breadcrumb, Button, Modal, ModalBody, ModalHeader , Label} from "reactstrap";
import { Link } from 'react-router-dom';
import {LocalForm , Control, Errors } from 'react-redux-form';
import {Loading} from './LoadingComponent'; 
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required  = val => val && val.length;
const maxLength = len => val => !(val) || (val.length<=len);
const minLength = len => val => val && (val.length>=len);

class CommentForm extends Component {
    constructor(props){
        super(props);
        this.handleComment = this.handleComment.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state= {
            isModalOpen : false
        };
        
    }
    handleComment(values){
        this.props.postComment(this.props.dishId, values.rating, values.name, values.comment);
    }
    toggleModal(){
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
    }

    render(){
        return(
            <React.Fragment>
            <Button outline onClick={this.toggleModal}><span className="fas fa-pencil fa-lg"></span> Submit Comment</Button>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                <ModalBody>
                <LocalForm onSubmit={(values) => this.props.postComment(this.props.dishId, values.rating, values.name, values.comment)}>
                            <div className="form-group">
                                <Label htmlFor="rating">Rating </Label>
                                <Control.select model=".rating" name="rating"
                                            id="rating"
                                            className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option selected >5</option>
                                </Control.select>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="name">Your Name</Label>
                                <div>
                                    <Control.text model=".name" id="name" name="name"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators = {{
                                            required, minLength:minLength(3), maxLength:maxLength(15)
                                        }}
                                        />
                                    <Errors
                                        className="text-danger"
                                        show="touched"
                                        model=".name"
                                        messages={{
                                            required:"Required ",
                                            minLength:"Must be greater than 2 characters",
                                            maxLength:"Must be 15 characters or less"
                                        }} 
                                    />   
                                </div>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="comment">Comment</Label>
                                <div>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                    rows="6"
                                    className="form-control" />
                                </div>
                            </div>
                            <div className="form-group">
                                <Button type="submit" color="primary">
                                    Submit
                                </Button>
                            </div>
                        </LocalForm>
                </ModalBody>
            </Modal>
            </React.Fragment>
        );
    }
} 



function RenderComments({comments,postComment,dishId}){
    if(comments==null){
        return(
            <div></div>
        );
    }else{
        return(
            <Stagger in>
                {comments.map((comment) => {
                    return (
                        <Fade in>
                        <li key={comment.id}>
                        <p>{comment.comment}</p>
                        <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                        </li>
                        </Fade>
                    );
                })}
            </Stagger>
        );
    }
}
function RenderDishDetail({dish}){
    return (
        <FadeTransform
            in
            transformProps={{
                exitTransform: 'scale(0.5) translateY(-50%)'
            }}>
        <Card>
            <CardImg top src={baseUrl + dish.image} alt={dish.name} />
            <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
            </CardBody>
        </Card>
        </FadeTransform>
);
}
const DishDetail = (props)=>{
        if(props.isLoading){
            return (
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if(props.errMess){
            return (
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if(props.dish!=null){
            return (
                <div className="container">
                        <div className="row">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                                <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                            </Breadcrumb>
                            <div className="col-12">
                                <h3>{props.dish.name}</h3>
                                <hr/>
                            </div>      
                        </div>
                    <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDishDetail dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5">
                        <h4>Comments</h4>
                        <ul className="list-unstyled">
                            <RenderComments comments={props.comments} />
                        </ul>
                        <CommentForm dishId={props.dish.id} postComment={props.postComment}/>
                    </div>
                </div>
                </div>
            );
        }else{
            return(
                <div></div>
            );
        }
}

export default DishDetail;