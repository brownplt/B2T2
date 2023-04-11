require './row'
require './schema'
require './table_api'

RSpec.describe TableAPI do
  describe ".empty_table" do
    it "creates a table with an empty schema and no rows" do
      table = TableAPI.empty_table

      expect(TableAPI.schema(table)).to eq([])
      expect(TableAPI.nrows(table)).to eq(0)
    end
  end

  describe ".add_rows" do
    let(:headers) { ["header_a", "header_b"]}

    let(:schema) { Schema.new(headers: headers)}
    let(:row_a) { Row.new(schema, [1, true])}
    let(:row_b) { Row.new(schema, [2, true])}
    let(:row_c) { Row.new(schema, [3, false])}

    context "orginal table contains existing rows" do
      context "it adds a row" do
        it "creating a new table with two rows" do
          original_table = Table.new(schema: schema, rows: [row_a])
          rows_to_add = [row_b, row_c]
  
          new_table = TableAPI.add_rows(original_table, rows_to_add)
  
          expect(TableAPI.nrows(new_table)).to eq(3)
        end
      end

      context "it adds no rows, an empty sequence" do
        it "creating a new table with one rows" do
          original_table = Table.new(rows: [row_a, row_b])
          rows_to_add = []
  
          new_table = TableAPI.add_rows(original_table, rows_to_add)
  
          expect(TableAPI.nrows(new_table)).to eq(2)
        end
      end
    end
  end

  describe ".add_column" do
    let(:headers) { ["header_a", "header_b"]}

    let(:schema) { Schema.new(headers: headers)}
    let(:row_a) { Row.new(schema.clone, [1, true])}
    let(:row_b) { Row.new(schema.clone, [2, true])}
    let(:row_c) { Row.new(schema.clone, [3, false])}

    context "original table is empty" do
      # ASSUMPTION: if adding a column to an empty table, then we don't add an values
      it "adds column and a value for all existing rows" do
        original_table = TableAPI.empty_table

        new_table = TableAPI.add_column(original_table, "header_a", [])

        expect(TableAPI.headers(new_table).size).to eq(1)
        expect(TableAPI.nrows(new_table)).to eq(0)
      end
    end

    context "original table contains a schema but no rows" do
      # ASSUMPTION: if adding a column to an empty table, then we don't add an values
      it "adds column and a value for all existing rows" do
        original_table = Table.new(schema: schema)

        new_table = TableAPI.add_column(original_table, "header_c", [])

        expect(TableAPI.headers(new_table).size).to eq(3)
        expect(TableAPI.nrows(new_table)).to eq(0)
      end
    end

    context "original table contains a schema and rows" do
      it "adds column and a value for all existing rows" do
        original_table = Table.new(schema: schema.dup, rows: [row_a, row_b, row_c])

        new_table = TableAPI.add_column(original_table, "header_c", ["a", "b", "c"])

        expect(TableAPI.headers(new_table).size).to eq(3)
        expect(TableAPI.nrows(new_table)).to eq(3)
      end
    end
  end
end
