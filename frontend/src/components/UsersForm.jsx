import "./UsersForm.css"

function UsersForm(props) {
    return (
        <div className="userFormContainer">
        <h2>User Information</h2>
        <form onSubmit={props.onSubmit}>

            {props.showName && (
            <>
            <label htmlFor="name">Name*</label>
            <input
            id="name"
            type="text"
            value={props.name}
            onChange={props.onNameChange}
            />
            </>
            )}

            {props.showEmail && (
            <>
            <label htmlFor="email">Email*</label>
            <input
            id="email"
            type="text"
            value={props.email}
            onChange={props.onEmailChange}
            />
            </>
            )}

            {props.showPassword && (
            <>
            <label htmlFor="password">Password*</label>
            <input
            id="password"
            type="password"
            value={props.password}
            onChange={props.onPasswordChange}
            />
            </>
            )}

            {props.showLocation && (
            <>
            <label htmlFor="location">Location, as if anyone cares.</label>
            <input
            id="location"
            type="text"
            value={props.location}
            onChange={props.onLocationChange}
            />
            </>
            )}

            {props.showBio && (
            <>
            <label htmlFor="bio">Bio, try not to be boring.</label>
            <textarea
            id="bio"
            type="text"
            value={props.bio}
            onChange={props.onBioChange}
            rows="5"
            maxLength="256"
            />
            </>
            )}

            {props.showDOB && (
            <>
            <label htmlFor="dob">Date of Birth, show us how close to dying you are.</label>
            <input
            className="dob"
            id="dob"
            type="date"
            value={props.dob}
            onChange={props.onDOBChange}
            />
            </>
            )} 

            {props.showStatus && (
            <>
            <label htmlFor="status">Status, don't be gross about it.</label>
            <textarea
            id="status"
            type="text"
            value={props.status}
            onChange={props.onStatusChange}
            rows="2"
            maxLength="64"
            />
            </>
            )}
            
            <input role="submit-button" id="submit" type="submit" value="Submit" />
        </form>
        <p>
            ( * ) required
        </p>
        </div>
    )
}

export default UsersForm;