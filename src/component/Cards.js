'use client'

import Link from "next/link"

export default function Card(props) {
    return (
        <>
            <Link href={props.throw} className={props.cardStyle}>
                <img className={props.imgStyle} src={props.url} alt="" />
                <div className="card-content text-center my-2">
                    <h3 className={`text-sm font-bold ${props.namaStyle}`}>{props.nama}</h3>
                    <p className={`text-xs`}>{props.divisi}</p>
                </div>
            </Link>
        </>
    )
}