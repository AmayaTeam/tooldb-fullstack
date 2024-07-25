ALTER TABLE measure
ADD COLUMN default_unit UUID;

ALTER TABLE measure
ADD CONSTRAINT fk_default_unit
FOREIGN KEY (default_unit) REFERENCES unit(id);
