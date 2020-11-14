import ReactStars from "react-rating-stars-component";
import React, { ReactElement } from "react";
import styles from './Rate.module.css'; 

export default function Rate() : ReactElement {

    const ratingChanged = ({newRating} : {newRating: number}) => {
        console.log(newRating);
    };
    
    return (
        <aside className={styles.rateWrapper}>
            <aside className={styles.rateRegion}>
                Rate this dataset:
                <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    isHalf={true}
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    fullIcon={<i className="fa fa-star"></i>}
                    color="#000000"
                    activeColor="#ff4092"
                />
            </aside>
            <aside className={styles.rateRegion}>
                Leave a review:
            </aside>
        </aside>
    )
}