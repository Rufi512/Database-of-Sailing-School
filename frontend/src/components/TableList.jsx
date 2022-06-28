import React, { useState, useEffect } from "react";

import "../static/styles/table-list.css";
import { ReactComponent as EditIcon } from "../static/icons/pencil.svg";
import { ReactComponent as DeleteIcon } from "../static/icons/trash-solid.svg";
const TableList = (props) => {
	const [screenSize, setScreenSize] = useState({
		current: window.innerWidth,
	});
	const [labels, setLabels] = useState([]);
	const [actions, setActions] = useState([]);
	const [data, setData] = useState([]);
	useEffect(() => {
		window.addEventListener("resize", () => {
			setScreenSize({ current: window.innerWidth });
			console.log(screenSize.current);
		});
		window.addEventListener("load", () => {
			setScreenSize({ current: window.innerWidth });
		});
		setLabels(props.labels);
		setData(props.data);
		setActions(props.actions);
		return () => {
			window.removeEventListener("resize", () => {
				setScreenSize({ current: window.innerWidth });
			});
		};
	}, [props]);

	return (
		<>
			<div className="table-general">
				<div className="header-field">
					{labels.map((el, i) => {
						if (!labels[i - 1] && el.nameField) {
							return (
								<p key={i} scope="col">
									{" "}
									{el.nameField}
								</p>
							);
						}

						if (
							labels[i - 1] &&
							!labels[i - 1].linked &&
							!el.linked && 
							el.nameField
						) {
							return (
								<p key={i} scope="col">
									{" "}
									{el.nameField}
								</p>
							);
						}

						if (el.linked && el.nameField) {
							return (
								<p key={i} scope="col">
									{" "}
									{el.nameField} y {labels[i + 1].nameField}{" "}
								</p>
							);
						}
					})}
				</div>
				<div className="table-body-select">
					{data.map((el, i) => (
						<div className="data-body" key={i}>
							{labels.map((label, idx) => {
								if(label.field === 'actions') return
								if (!labels[idx - 1]) {
									return (
										<p
											className={`${label.field}`}
											key={idx}
										>
											{screenSize.current < 1024 ? (
												<span
													style={{
														fontWeight: "600",
													}}
												>
													{label.nameField}:
												</span>
											) : (
												""
											)}{" "}
											{el[label.field]}
										</p>
									);
								}

								if (idx === 0 && el[label.field])

									return (
										<p
											className={`${label.field}`}
											key={idx}
										>
											{screenSize.current < 1024 ? (
												<span
													style={{
														fontWeight: "600",
													}}
												>
													{label.nameField}:
												</span>
											) : (
												""
											)}{" "}
											{el[label.field]}
										</p>
									);

								if (el[label.field] === true && el[label.field] !== undefined) {
									return (
										<p
											className={`${label.field}`}
											key={idx}
										>
											{screenSize.current < 1024 ? (
												<span
													style={{
														fontWeight: "600",
													}}
												>
													{label.nameField}:
												</span>
											) : (
												""
											)}{" "}
											Activo
										</p>
									);
								}

								if (el[label.field] === false && el[label.field] !== undefined) {
									return (
										<p
											className={`${label.field}`}
											key={idx}
										>
											{screenSize.current < 1024 ? (
												<span
													style={{
														fontWeight: "600",
													}}
												>
													{label.nameField}:
												</span>
											) : (
												""
											)}{" "}
											Inactivo
										</p>
									);
								}

								//If exists linked return concat
								if (label.linked && el[label.field]) {
									return (
										<p
											className={`${label.field}`}
											key={idx}
										>
											{screenSize.current < 1024 ? (
												<span
													style={{
														fontWeight: "600",
													}}
												>
													{label.nameField} y{" "}
													{labels[idx + 1].nameField}:
												</span>
											) : (
												""
											)}{" "}
											{`${el[label.field]} ${
												el[labels[idx + 1].field]
											}`}
										</p>
									);
								}

								if (
									labels[idx - 1] &&
									!labels[idx - 1].linked &&
									!label.linked &&
									el[label.field]
								) {
									return (
										<p
											className={`${label.field}`}
											key={idx}
										>
											{screenSize.current < 1024 ? (
												<span
													style={{
														fontWeight: "600",
													}}
												>
													{label.nameField}:
												</span>
											) : (
												""
											)}{" "}
											{el[label.field]}
										</p>
									);
								}
								/*if(labels[idx-1] && !labels[idx-1].linked && !label.linked){
									return <p className={`${label.field}`} key={idx}>{screenSize.current < 1024 ? (<span style={{fontWeight:'600'}}>{label.nameField}:</span>) : ''} {`${el[label.field]}`}</p>;
								}*/
							})}
							{actions.length > 0 ? (
								<div className="container-actions">
									{actions.map((act, i) => {
										return (
											<button
												className={`btn ${
													act.name === "delete"
														? "btn-danger"
														: "btn-primary"
												}`}
												onClick={(e) => {
													act.func(el.id);
												}}
												key={i}
											>
												{act.name === "edit" ? (
													<EditIcon
														style={{
															width: "18px",
														}}
													/>
												) : (
													<DeleteIcon
														style={{
															width: "18px",
														}}
													/>
												)}
											</button>
										);
									})}
								</div>
							) : (
								""
							)}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default TableList;