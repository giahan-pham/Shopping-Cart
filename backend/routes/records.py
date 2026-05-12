from typing import List
from fastapi import APIRouter, HTTPException, Depends, Response, status
from sqlmodel import Session, select
from core.database import get_session
from models import Record, User
from schema import RecordCreate, RecordRead, RecordUpdate
from core.security import admin_required

router = APIRouter(prefix="/records", tags=["records"])

#endpoint to create a new record
@router.post("/", response_model=RecordRead, status_code=status.HTTP_201_CREATED)
def create_record(record_create: RecordCreate, 
                  session: Session = Depends(get_session), 
                  admin_user: User = Depends(admin_required)):
    record = Record.model_validate(record_create)
    session.add(record)
    session.commit()
    session.refresh(record)
    return record

#endpoint to get all records
@router.get("/", response_model=List[RecordRead])
def get_all_records(session: Session = Depends(get_session)):
    records = session.exec(select(Record)).all()
    return records

#endpoint to get a record by id
@router.get("/{record_id}", response_model=RecordRead)
def get_record(record_id : int, session: Session = Depends(get_session)):
    record = session.get(Record, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    return record

#endpoint to update a record by id
@router.patch("/{record_id}", response_model = RecordRead)
def update_record(record_id: int, record_update: RecordUpdate, 
                  session: Session = Depends(get_session), 
                  admin_user: User = Depends(admin_required)):
    record = session.get(Record, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    record_data = record_update.model_dump(exclude_unset=True)
    for key, value in record_data.items():
        setattr(record, key, value)
    session.add(record)
    session.commit()
    session.refresh(record)
    return record

#endpoint to delete a record by id
@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_record(record_id: int, 
                  session: Session = Depends(get_session), 
                  admin_user: User = Depends(admin_required)):
    record = session.get(Record, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    session.delete(record)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)