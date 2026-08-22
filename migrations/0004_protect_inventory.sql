PRAGMA foreign_keys = ON;

CREATE TRIGGER prevent_negative_variant_stock
BEFORE UPDATE OF stock ON product_variants
FOR EACH ROW
WHEN NEW.stock < 0
BEGIN
  SELECT RAISE(ABORT, 'Insufficient stock');
END;
