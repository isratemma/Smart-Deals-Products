import React, { useRef } from 'react';
import { useLoaderData } from 'react-router-dom';

const ProductDetails = () => {
  const product = useLoaderData();

  const bidModalRef = useRef(null);
  const handleBidModalOpen = () => {
    bidModalRef.current.showModal();
  };


  console.log(product);
  return (
    <div>
      <div>
        <div></div>
        <div>
          <button onClick={handleBidModalOpen} className="btn btn-primary">
            I want to buy this product
          </button>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="$$btn"
            onClick={() => document.getElementById('my_modal_5').showModal()}
          >
            open modal
          </button>
          <dialog
            ref={bidModalRef}
            className="$$modal $$modal-bottom sm:$$modal-middle"
          >
            <div className="$$modal-box">
              <h3 className="font-bold text-lg">Give the best offer!</h3>
              <p className="py-4">
                Offer something seller can not resist
              </p>
              <div className="$$modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="$$btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
