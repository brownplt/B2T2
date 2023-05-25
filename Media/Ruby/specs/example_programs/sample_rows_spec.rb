# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/table_encoder'
require './lib/type_extensions'

# rubocop:disable RSpec/DescribeClass

# gradebook: a gradebook table with some missing values
RSpec.describe 'sample rows' do
  include Basics

  describe 'appends average quiz score to gradebook' do
    let(:raw_table_string) do
      "
      #   | name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
      #   | ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
      #   | \"Bob\"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
      #   | \"Alice\" | 17  | 6     | 8     | 88      |       | 7     | 85    |
      #   | \"Eve\"   | 13  |       | 9     | 84      | 8     | 8     | 77    |
      "
    end

    # > sampleRows =
    # function(t, n):
    #   indexes = sample(range(nrows(t)), n)
    #   selectRows(t, indexes)
    # end
    # > sampleRows(gradebookMissing, 2)
    # | name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
    # | ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
    # | "Eve"   | 13  |       | 9     | 84      | 8     | 8     | 77    |
    # | "Alice" | 17  | 6     | 8     | 88      |       | 7     | 85    |
    context 'when happy path' do
      it 'samples rows' do
        # start with a gradebook table
        gradebook_missing = TableEncoder.encode(raw_table_string)

        expect(gradebook_missing.nrows).to eq(3)
        expect(gradebook_missing.ncols).to eq(8)

        sample_rows = lambda do |t, _n|
          indexes = range(t.nrows).sample(2)
          Table.select_rows_by_indecies(t, indexes)
        end

        sample_rows_values = sample_rows.call(gradebook_missing, 2)

        expect(sample_rows_values.nrows).to eq(2)
        expect(sample_rows_values.ncols).to eq(8)
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
