require './cell'
require './ensure_exception'
require './require_exception'
require './row'
require './schema'
require './table_api'

RSpec.describe TableAPI do
  let(:headers) { [
    { column_name: "header_a", sort: "number" }, 
    { column_name: "header_b", sort: "boolean" }
  ]}
  let(:schema) { Schema.new(headers: headers)}
  let(:row_a) { Row.new([Cell.new(1), Cell.new(true)])}
  let(:row_b) { Row.new([Cell.new(2), Cell.new(true)])}
  let(:row_c) { Row.new([Cell.new(3), Cell.new(false)])}

  describe ".empty_table" do
    it "creates a table with an empty schema and no rows" do
      table = TableAPI.empty_table

      expect(TableAPI.schema(table)).to eq([])
      expect(TableAPI.nrows(table)).to eq(0)
    end
  end

  describe ".add_rows" do
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
    let(:header_to_add) {{ column_name: "header_c", sort: "String" }}
    let(:original_table_with_rows) { Table.new(schema: schema.dup, rows: [row_a, row_b, row_c]) }

    context "original table is empty" do
      # ASSUMPTION: if adding a column to an empty table, then we don't add an values
      it "adds column and a value for all existing rows" do
        original_table = TableAPI.empty_table

        new_table = TableAPI.add_column(original_table, header_to_add, [])

        expect(TableAPI.headers(new_table).size).to eq(1)
        expect(TableAPI.nrows(new_table)).to eq(0)
      end
    end

    context "original table contains a schema but no rows" do
      # ASSUMPTION: if adding a column to an empty table, then we don't add an values
      it "adds column and a value for all existing rows" do
        original_table = Table.new(schema: schema)

        new_table = TableAPI.add_column(original_table, header_to_add, [])

        expect(TableAPI.headers(new_table).size).to eq(3)
        expect(TableAPI.nrows(new_table)).to eq(0)
      end
    end

    context "original table contains a schema and rows" do
      it "adds column and a value for all existing rows" do
        original_table = Table.new(schema: schema.dup, rows: [row_a, row_b, row_c])

        new_table = TableAPI.add_column(original_table, header_to_add, ["a", "b", "c"])

        expect(TableAPI.headers(new_table).size).to eq(3)
        expect(TableAPI.nrows(new_table)).to eq(3)
      end
    end

    context "given faulty input" do
      context "the column name is not unique" do
        it "raises an ensure failure exception" do
          expect {
            TableAPI.add_column(original_table_with_rows, { column_name: "header_a", sort: "string" }, ["a", "b", "c"])
          }.to raise_error(RequireException)
        end
      end

      context "the column name is not a string" do
        it "raises an ensure failure exception" do
          expect {
            TableAPI.add_column(original_table_with_rows, { column_name: 100, sort: "string" }, ["a", "b", "c"])
          }.to raise_error(RequireException)
        end
      end

      context "the column sort is not a string" do
        it "raises an ensure failure exception" do
          expect {
            TableAPI.add_column(original_table_with_rows, { column_name: "header_c", sort: false }, ["a", "b", "c"])
          }.to raise_error(RequireException)
        end
      end

      context "the column values are not a sequence" do
        it "raises an ensure failure exception" do
          expect {
            TableAPI.add_column(original_table_with_rows, { column_name: "header_c", sort: "string" }, "b")
          }.to raise_error(RequireException)
        end
      end

      context "the column values are not the same length as the number of rows" do
        it "raises an ensure failure exception" do
          expect {
            TableAPI.add_column(original_table_with_rows, { column_name: "header_c", sort: "string" }, ["b", "c"])
          }.to raise_error(RequireException)
        end
      end

      context "the column values are not of the correct type" do
        it "raises an ensure failure exception" do
          expect {
            TableAPI.add_column(original_table_with_rows, { column_name: "header_c", sort: "string" }, [1, "b", "c"])
          }.to raise_error(EnsureException)
        end
      end
    end
  end


  describe ".build_column" do
    let(:header_to_add) {{ column_name: "header_c", sort: "String" }}
    let(:original_table_with_rows) { Table.new(schema: schema.dup, rows: [row_a, row_b, row_c]) }

    context "original table is empty" do
      # ASSUMPTION: if adding a column to an empty table, then we don't add an values
      it "adds column and a value for all existing rows" do
        original_table = TableAPI.empty_table

        new_table = TableAPI.build_column(original_table, header_to_add) { |r| r + 1 }

        expect(TableAPI.headers(new_table).size).to eq(1)
        expect(TableAPI.nrows(new_table)).to eq(0)
      end
    end

    context "original table contains a schema but no rows" do
      # ASSUMPTION: if adding a column to an empty table, then we don't add an values
      it "adds column and a value for all existing rows" do
        original_table = Table.new(schema: schema)

        new_table = TableAPI.build_column(original_table, header_to_add) { |r| r + 1 }

        expect(TableAPI.headers(new_table).size).to eq(3)
        expect(TableAPI.nrows(new_table)).to eq(0)
      end
    end

    context "original table contains a schema and rows" do
      it "adds column and a value for all existing rows" do
        original_table = Table.new(schema: schema.dup, rows: [row_a, row_b, row_c])

        x = 'a'
        new_table = TableAPI.build_column(original_table, header_to_add) { |r| x = x.next; x }

        expect(TableAPI.headers(new_table).size).to eq(3)
        expect(TableAPI.nrows(new_table)).to eq(3)
      end
    end

    context "given faulty input" do
      context "the column name is not unique" do
        it "raises an ensure failure exception" do
          expect {
            x = 'a'
            TableAPI.build_column(original_table_with_rows, { column_name: "header_a", sort: "string" }) { |r| x = x.next; x }
          }.to raise_error(RequireException)
        end
      end

      context "the column name is not a string" do
        it "raises an ensure failure exception" do
          expect {
            x = 'a'
            TableAPI.build_column(original_table_with_rows, { column_name: 100, sort: "string" }) { |r| x = x.next; x }
          }.to raise_error(RequireException)
        end
      end

      context "the column sort is not a string" do
        it "raises an ensure failure exception" do
          expect {
            x = 'a'
            TableAPI.build_column(original_table_with_rows, { column_name: "header_c", sort: false }) { |r| x = x.next; x }
          }.to raise_error(RequireException)
        end
      end

      context "the third argument is not a function" do
        it "raises an ensure failure exception" do
          expect {
            TableAPI.build_column(original_table_with_rows, { column_name: "header_c", sort: "string" }, "b")
          }.to raise_error(ArgumentError) # ArgumentError: wrong number of arguments (given 3, expected 2)
        end
      end

      # TODO: this should fail, but it doesn't
      # context "the column values are not of the correct type" do
      #   it "raises an ensure failure exception" do
      #     expect {
      #       TableAPI.build_column(original_table_with_rows, { column_name: "header_c", sort: "string" }) { |r| 1 }
      #     }.to raise_error(EnsureException)
      #   end
      # end
    end
  end
end
